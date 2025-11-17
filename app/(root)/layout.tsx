import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated) redirect('/sign-in');
  
  return (
    <div
      className='root-layout'
    >
      <nav>
        <Link href='/' className='flex items-center gap-2'>
          <Image src="/icon.svg" alt='logo' width={38} height={38} />
          <h2 className='text-primary-100'>PrepEdge</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout