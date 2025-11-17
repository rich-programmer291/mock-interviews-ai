import { Button } from '@/components/ui/button'
import InterviewCard from '@/components/InterviewCard'
import { dummyInterviews } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview Ready with AI-Powered Practice & Feedback</h2>
          <p>Practice with Real Interview Questions & get instant comprehensive feedback.</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        </div>
        <Image src='/robot.png' width={400} height={400} alt='robot-dude' className='max-sm:hidden' />
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview, index) => (
            <InterviewCard key={'i' + index} {...interview} />
          ))}
        </div>
          {/* <p>You haven&apos;t taken any Interviews Yet.</p> */}
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {/* <p>There are no Interviews Available</p> */}
          {dummyInterviews.map((interview, index) => (
            <InterviewCard key={'it' + index} {...interview} />
          ))}
        </div>

      </section>
    </>
  )
}

export default Page