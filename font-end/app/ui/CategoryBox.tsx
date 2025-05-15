'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { env } from '@/libs/env.helper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type TCategory = {
    _id: string,
    category_name: string,
    imageUrl: string,
    slug: string
}

//get all categories root(level = 0)
const fetchRootCategories = async(): Promise<TCategory[]> => {
    const response = await axios.get(`${env.API_URL}/categories/root?sort_type=asc`)
    //console.log('response.data:', response.data.data.categories);
    return response?.data?.data.categories;
}

const CategoryItem = ({category}: {category: TCategory}) => {
    const router = useRouter();
    return(
        <div 
        className='grid justify-center gap-y-3'
        onClick={() => {
            router.push(`/collections/${category.slug}`)
        }}
        >
            <div className='relative flex items-center w-[84px] h-[84px]'>
                <Image
                alt={category.category_name}
                src={category.imageUrl}
                fill
                sizes='(max-width: 84px) 100vw, 84px'
                loading='lazy'
                />
            </div>
            <h3 className='text-center text-base'>{category.category_name}</h3>
        </div>
    )
}

export default function CategoryBox() {
    const [categories, setCategories] = useState<TCategory[]>([]);
    //console.log('API===>', `${env.API_URL}/categories/root`);

    useEffect(() => {
        const getCategories = async() => {
            try {
                const data = await fetchRootCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        getCategories();
    },[]);

  return (
    <div className='bg-white'>
        <div>
            <h1 className='font-bold text-2xl px-2 py-4 text-gray-900 hover:text-red-500 cursor-pointer'>Danh mục sản phẩm</h1>
            <hr/>
        </div>
        <div className="grid grid-cols-10 gap-4 px-2 py-4 cursor-pointer">
        {categories.map((c) => (
            <CategoryItem key={c._id} category={c} />
        ))}
        </div>
    </div>
  )
}
