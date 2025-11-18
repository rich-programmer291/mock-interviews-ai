import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AgentProps {
  userName: string,
  type: string,
  userId: string
};

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
};

const Agent = ({ userName, type, userId }: AgentProps) => {
  const isSpeaking = true;
  const callStatus: CallStatus = CallStatus.ACTIVE;
  const messages = [
    "What's your name?",
    "My name is John Doe, nice to meet you!"
  ];
  const lastMessage = messages[messages.length - 1];

  return (
    <>
      <div className='call-view'>

        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/icon.svg" height={65} width={65} alt='vapi ai' className='object-cover' />
            {isSpeaking && <span className='animate-speak' />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image src="/user-avatar.png" width={540} height={540} alt='user avatar'
              className='rounded-full object-cover size-[120px]' />
            <h3>{userName}</h3>

          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className='relative btn-call'>
            <span className={cn('absolute animate-ping rouneded-full opacity-75', callStatus === CallStatus.CONNECTING & 'hidden')} />
            <span className="">{callStatus === CallStatus.INACTIVE || callStatus === 'FINISHED' ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className='btn-disconnect cursor-pointer'>End Call</button>
        )}
      </div >
    </>
  )
}

export default Agent