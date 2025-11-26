import React from 'react'
import Agent from '@/components/Agent'
import { getCurrentUserInfo } from '@/lib/actions/auth.action'
import TrialAgent from '@/components/TrialAgent';

const Page = async () => {
    const user = await getCurrentUserInfo();
    
    return (
        <>
            <h3>Interview Generation</h3>
            <TrialAgent userName={user?.name} userId={user?.id} type="generate" />
        </>
    )
}

export default Page