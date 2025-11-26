import React from 'react'
import { getInterviewbyId, getFeedbackbyInterviewId } from '@/lib/actions/general.action'
import { redirect } from 'next/navigation';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import TrialAgent from '@/components/TrialAgent';
import { getCurrentUserInfo } from '@/lib/actions/auth.action';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUserInfo();
    const interview = await getInterviewbyId(id);
    const feedback = await getFeedbackbyInterviewId({
        interviewId: id,
        userId: user?.id
    }) || undefined;

    if (!interview) redirect('/');

    return (
        <>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <Image src={getRandomInterviewCover()} alt="cover-image" width={40} height={40}
                            className='rounded-full size-[40px] object-cover' />
                        <h3 className="capitalize">{interview.role}</h3>

                        <DisplayTechIcons techStack={interview.techstack} />
                    </div>
                </div>
                <div className='flex flex-row gap-2'>
                    <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>{interview.type}</p>

                    {
                        feedback && (
                            <div className="past-feedbacks justify-end">
                                <Button className='p-5 bg-slate-300'>
                                    <Link href={`/interview/${id}/feedback`}>View Past Feedback</Link>
                                </Button>
                            </div>)
                    }
                </div>
            </div>

            <TrialAgent userName={user?.name} userId={user?.id} type='interview' interviewId={id} questions={interview.questions} />

        </>
    )
}

export default page