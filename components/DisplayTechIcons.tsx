import { cn, getTechLogos } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

interface TechIconProps {
    techStack: string[];
}

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
    const techIcons = await getTechLogos(techStack);
    return (
        <div className='flex flex-row'>
            {techIcons.slice(0,3).map(({tech,url},index)=>(
                <div key={tech+index} className={cn("relative group bg-dark-300 rounded-full p-2 flex-center", index >= 1 && '-ml-3')}>
                    <span className='tech-tooltip'>{tech}</span>
                    <Image src={url} alt={tech}  width={25} height={25}/>
                </div>
            ))}
        </div>
    )
}

export default DisplayTechIcons