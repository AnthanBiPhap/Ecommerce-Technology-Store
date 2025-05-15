'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {env} from '../../../libs/env.helper';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type TTechNew = {
    _id: string,
    title: string,
    keyword: string,
    thumbnail: string,
    description: string,
    content: string,
    date: Date
}

//get all technology news
const fetchTechNews = async(): Promise<TTechNew[]> => {
    const response = await axios.get(`${env.API_URL}/technews`);
    return response?.data?.data.techNews;
}

const TechNewItem = ({techNews}:{techNews: TTechNew}) => {
    const router = useRouter();
    return (
        <div 
        onClick={() => {
            router.push(`/pages/tin-tuc-cong-nghe/${techNews._id}`)
        }}
        className='p-2 cursor-pointer'
        >
            <div className='relative w-[278px] h-[145px]'>
                <Image 
                alt={techNews.title}
                src={techNews.thumbnail}
                fill
                sizes='(max-width: 278px) 100vw, 278px'
                loading='lazy'
                className='rounded-sm object-cover'
            />
            </div>
            <h1 className='font-semibold text-gray-800 hover:text-red-500 mt-2'>{techNews.title}</h1>
        </div>
    )
}

export default function TechBoxSmall() {
    const [techNews, setTechNews] = useState<TTechNew[]>([]);

    useEffect(() => {
        const getTechNews = async() => {
            const data = await fetchTechNews();
            setTechNews(data);
        }
        getTechNews();
    },[])

    return (
        <div className='bg-white mt-2'>
            <div className='font-bold text-2xl px-2 py-4 text-gray-900 hover:text-red-500 cursor-pointer hover:!no-underline'>
                <Link href={`/pages/tin-tuc-cong-nghe`}>Tin tức công nghệ</Link>
            </div>
            <div className="flex">
                <Swiper
                modules={[Navigation, Pagination]} // Kích hoạt các module
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={4}
                >
                {techNews.map((t) => (
                    <SwiperSlide 
                    key={t._id}>
                        <TechNewItem
                        key={t._id}
                        techNews={t}
                        />
                    </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )    
}