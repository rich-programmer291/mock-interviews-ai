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

export async function getInterviewbyId(id: string): Promise<Interview | null> {
    const interview = await db.collection('interviews').doc(id).get();
    // console.log(interview);
    return interview.data() as Interview | null;
}