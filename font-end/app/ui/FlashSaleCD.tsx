'use client'

import React, { useEffect, useState } from 'react'

export default function FlashSaleCD() {
    const getStartCountdown = () => {
        const now = new Date();
        const start = new Date();
        start.setHours(10, 0, 0, 0); // Flash Sale bắt đầu lúc 10h sáng
      
        // Nếu đã quá 10h thì đếm đến 10h ngày mai
        if (now.getTime() > start.getTime()) {
          start.setDate(start.getDate() + 1);
        }
      
        return start.getTime() - now.getTime(); // milliseconds còn lại
      };

      const [countdown, setCountdown] = useState({
        hours: '00',
        minutes: '00',
        seconds: '00',
      });

    useEffect(() => {
    const updateCountdown = () => {
        const msLeft = getStartCountdown();
        const totalSeconds = Math.floor(msLeft / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setCountdown({
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
          });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
    }, []);

  return (
    <div className='flex px-2 py-1 gap-x-2 bg-white items-center rounded-sm'>
        <span className='font-medium'>Bắt đầu sau:</span>
        <div className='flex gap-x-1 items-center text-white font-semibold'>
            <div className='bg-black px-2 py-1 rounded'>{countdown.hours}</div>
            <span className='font-bold text-black'>:</span>
            <div className='bg-black px-2 py-1 rounded'>{countdown.minutes}</div>
            <span className='font-bold text-black'>:</span>
            <div className='bg-black px-2 py-1 rounded'>{countdown.seconds}</div>
        </div>
    </div>
  )
}
