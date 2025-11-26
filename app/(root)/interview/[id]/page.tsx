import React from 'react'
import { getInterviewbyId } from '@/lib/actions/general.action'
import { redirect } from 'next/navigation';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import TrialAgent from '@/components/TrialAgent';
import { getCurrentUserInfo } from '@/lib/actions/auth.action';

const page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUserInfo();
    const interview = await getInterviewbyId(id);

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
                <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>{interview.type}</p>

            </div>
            <TrialAgent userName={user?.name} userId={user?.id} type='interview' interviewId={id} questions={interview.questions} />
        </>
    )
}

export default page