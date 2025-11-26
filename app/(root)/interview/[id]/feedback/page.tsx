import { getCurrentUserInfo } from '@/lib/actions/auth.action';
import { getFeedbackbyInterviewId, getInterviewbyId } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import dayjs from 'dayjs';
import { email } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUserInfo();
    const interview = await getInterviewbyId(id);
    if (!interview) redirect('/');


    const feedback = await getFeedbackbyInterviewId({
        interviewId: id,
        userId: user?.id
    }) || undefined;

    const formattedDate = dayjs(feedback?.createdAt || Date.now()).format('MMM D, YYYY - h:mm A');


    return (
        <>
            <div className="section-feedback text-center ">
                <h2>
                    Feedback on the Interview — <br />
                    <span className='capitalize'>{interview.role} interview</span>
                </h2>
                <div className="flex flex-row gap-8 mt-3 justify-center">
                    <div className="flex flex-row gap-2 items-center">
                        <Image src='/star.svg' alt="star" height={22} width={22} className="color-light-400" />
                        <p>Overall Score: {feedback?.totalScore || '---'}/100</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Image src='/calendar.svg' alt="calendar icon" height={22} width={22} className="color-light-400" />
                        <p>{formattedDate}</p>
                    </div>
                </div>
                <hr className='w-full' />
                <div className="details text-left">
                    <p><strong>Candidate :- </strong> {user?.name}</p>
                    <p><strong>Email :-</strong> {user?.email}</p>
                </div>

                <div>
                    <p className='text-justify'><strong>Final Assessment: </strong>{feedback?.finalAssessment}</p>
                </div>
                <div className='text-left'>
                    <h3 >Breakdown of the Evaluation</h3>
                    {feedback?.categoryScores?.map((cat, i) => (
                        <div key={cat.name+i} className='mt-4 px-5'>
                            <p className='font-semibold'>{i + 1}. {cat.name} ( {cat.score} / 100 )</p>
                            <p className='px-10 text-justify'>{cat.comment}</p>
                        </div>
                    ))}
                </div>
                <div className='text-left'>
                    <h3>Areas for Improvement</h3>
                    {feedback?.areasForImprovement?.map((a, i) => (
                        <div key={"areasForImp"+i} className='mt-4 px-5'>
                            <p>{i + 1}.  {a}</p>
                        </div>
                    ))}
                </div>
                <div className="final-verdict flex justify-left items-center gap-5">
                    <h2>Final Verdict: </h2>
                    <Button className={`bg-gray-800 ${feedback?.totalScore>75 ? 'text-green-400' : 'text-red-300'} hover:bg-gray-900 text-lg p-6 cursor-pointer `}>
                        {feedback?.totalScore>75 ? "Recommended" : "Not Recommended"}</Button>
                </div>

                <div className="mt-4 flex flex-row gap-5 justify-center">
                    <Button className='btn-primary w-1/2'>
                        <Link href={'/'} >Back to Dashboard</Link>
                    </Button>
                    <Button className='btn-primary w-1/2'>
                        <Link href={`/interview/${id}`} >Retake Interview</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default page