'use client'

import React from 'react'
import { useRouter } from 'next/navigation';

interface IIconheader {
    icon: React.ReactNode,
    title: React.ReactNode,
    url: string
}


export default function IconHeader({icon, title, url} : IIconheader) {
    const router = useRouter();
    const onHandleClick = () => {
    router.push(`${url}`);
}
  return (
    <div className='flex items-center text-white gap-x-2 font-bold cursor-pointer'
    onClick={onHandleClick}
    >
        <span className='text-[22px]'>
          {icon}
        </span>
        <div className='text-[13px]'>
          {title}
        </div>
    </div>
  )
}
