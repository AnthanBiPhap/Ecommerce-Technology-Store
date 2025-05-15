'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {env} from '../../../libs/env.helper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
  } from "@/components/ui/pagination";

type TTechNew = {
    _id: string,
    title: string,
    keyword: string,
    thumbnail: string,
    description: string,
    content: string,
    date: Date
}

type TData = {
    techNews: TTechNew[];
    pagination: {
        totalRecord: number,
        page: number,
        limit: number
    };
};

export default function TechBoxActive() {
    const [data, setData] = useState<TData | null>(null);
    const router = useRouter();
    const limit = 8;
    const [currentPage, setCurrentPage] = useState(1);

    //get all Data technology news
const fetchData = async(page: number): Promise<TData | undefined> => {
    try {
        const response = await axios.get(`${env.API_URL}/technews?page=${page}&limit=${limit}`);
        return response?.data?.data;
    } catch (error) {
        console.error('fetching data failed', error);
    }
}

    useEffect(() => {
        const getData = async() => {
            const result = await fetchData(currentPage);
            if(result !== undefined) {
                setData(result);
            }
        }
        getData();
    },[currentPage])
    //console.log('Data ===>', data);
    const totalPages = Math.ceil((data?.pagination?.totalRecord ?? 0) / limit);

    const TechNewItem = ({techNews}:{techNews: TTechNew}) => {
   
        return (
            <div 
            onClick={() => {
                router.push(`/pages/tin-tuc-cong-nghe/${techNews._id}`)
            }}
            className='p-2'
            >
                <div className='relative w-[265px] h-[150px]'>
                    <Image 
                    alt={techNews.title}
                    src={techNews.thumbnail}
                    fill
                    className='rounded-sm object-cover'
                />
                </div>
                <h1 className='font-semibold text-gray-800 hover:text-red-500 mt-2'>{techNews.title}</h1>
            </div>
        )
    }

    return (
        <div className='bg-white mt-2'>
            <div className="grid grid-cols-4 gap-1 cursor-pointer">
                {data?.techNews.map((t) => (
                <TechNewItem
                key={t._id}
                techNews={t}
                />
                ))}
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <span className="text-sm px-3 py-2 border rounded">
                            Trang {currentPage} / {totalPages}
                        </span>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )    
}
