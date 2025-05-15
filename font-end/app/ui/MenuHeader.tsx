"use client"

import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function MenuHeader() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div 
    onClick={handleScrollToTop}
    className='flex items-center text-white font-bold gap-x-1 bg-[#be0117] p-1 rounded-sm cursor-pointer'>
        <span className='flex items-center'>
            <i 
            className="bi bi-list text-[22px]"
            ></i>
        </span>
        <h1 className='text-[13px]'>Danh mục</h1>
    </div>
  )
}
