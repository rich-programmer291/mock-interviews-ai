'use server';

import { auth, db } from "@/firebase/admin";
import { success } from "zod";
import { collection } from "firebase/firestore";
import { cookies } from "next/headers";

interface User {
    id: string,
    email: string,
    name: string
}

interface SignUpParams {
    uid: string,
    name: string,
    email: string,
    password: string,
}

interface SignInParams {
    email: string,
    idToken: string,
}

const one_week = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord?.exists) {
            return {
                success: false,
                message: 'User Already Exists. Please Sign In instead.'
            }
        }

        const userData = {
            name: name,
            email: email
        };

        const result = await db.collection('users').doc(uid).set(userData);

        return {
            success: true,
            message: 'Account Created Successfully. Please Sign In.'
        }
    } catch (err: any) {
        console.error('Error creating a user', err);

        if (err.code == 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'This Email is Already in use'
            }
        }

        return {
            success: false,
            message: 'Failed to create an Account'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: one_week * 1000  //7 days
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: one_week,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);


    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return null;
    try {
        const decodeClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodeClaims.uid).get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getCurrentUserInfo() {
    const user = await getCurrentUser();
    return user as User;
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function checkUserAuth() {
    return await isAuthenticated();
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return true;
}

export async function getInterviewbyUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db.collection('interviews').where("userId", '==', userId).orderBy('createdAt', 'desc').get();
    // console.log(interviews);
    return interviews.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    const interviews = await db.collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true)
        .where("userId", '!=', userId)
        .limit(limit)
        .get();

    // console.log(interviews);
    return interviews.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}
