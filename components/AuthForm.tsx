"use client"

import React from 'react'
// import {FormType} from './schema';

import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from "zod"

import { Button } from '@/components/ui/button'
import { Form } from "@/components/ui/form"
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import FormField from './FormField'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signIn, signUp } from '@/lib/actions/auth.action'

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string()
            .optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}
const AuthForm = async ({ type }: { type: FormType }) => {
    const isUserAuthenticated = await isAuthenticated();

    if (isUserAuthenticated) redirect('/');
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;

                try {
                    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                    console.log("Here is the Error:", userCredentials);
                    const result = await signUp({
                        uid: userCredentials.user.uid,
                        name: name!,
                        email,
                        password
                    })

                    if (!result?.success) {
                        toast.success(result?.message);
                        return;
                    }
                    toast.success('Account Created Successfully. Please sign in.')
                    router.push('/sign-in');
                } catch (error: any) {
                    console.log(error);
                    if (error.code === 'auth/email-already-in-use') {
                        toast.error('This Email is Already in use');
                    } else {
                        toast.error('Failed to create an Account');
                    }
                    router.push('/sign-in');
                }
            }
            else {
                const { email, password } = values;

                try {
                    const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                    const idToken = await userCredentials.user.getIdToken();

                    if (!idToken) {
                        toast.error('Sign in failed');
                        return;
                    }

                    await signIn({ email, idToken });
                    toast.success('Sign in Successfully.')
                    router.push('/');

                } catch (e: any) {
                    console.log(e);
                    if (e.code === 'auth/invalid-credential') {
                        toast.error("Hmm, those details don't look familiar. Could you please re-enter your credentials?");
                    } else {
                        toast.error('There is a problem while logging you in. Please Try Again.');
                    }
                }
            }
        }
        catch (error: any) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className='card-border lg:min-w-[566px] m-12'>
            <div className='flex flex-col gap-6 card py-14 px-10'>
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/icon.svg" alt="logo" width={38} height={32} />
                    <h2 className='text-primary-100'>PrepEdge</h2>
                </div>
                <h3 className='text-center font-semibold'>Practice Job Interviews with AI</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn &&
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder='Your Name' />
                        }
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder='Your Email Address'
                            type="email"
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder='Your Password'
                            type="password"
                        />
                        {!isSignIn && <p>Profile Picture</p>}
                        {!isSignIn && <p>Resume</p>}
                        <Button
                            className='btn'
                            type="submit">
                            {isSignIn ? 'Sign In' : 'Create an Account'}
                        </Button>
                    </form>
                </Form>
                <p className='text-center'>
                    {isSignIn ? 'No Account Yet?' : 'Have an Account Already!'}
                    <Link
                        className='font-bold text-user-primary ml-1'
                        href={!isSignIn ? '/sign-in' : '/sign-up'} >
                        {!isSignIn ? 'Sign In' : 'Sign Up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm