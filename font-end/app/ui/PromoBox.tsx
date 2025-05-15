'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from "next/navigation";



interface IPromoBox {
  key: number,
  name: string,
  imgUri: string,
  link: string,
}


export default function PromoBox({key, name, imgUri, link}: IPromoBox) {
  const router = useRouter();
  return (
    <div className='cursor-pointer'>
      <Image 
      key={key}
      alt={name}
      src={imgUri}
      width={318}
      height={159}
      loading='eager'
      onClick={() => {
        router.push(`${link}`)
      }}
      />
    </div>
  )
}
