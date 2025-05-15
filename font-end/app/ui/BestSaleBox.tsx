'use client'

import { env } from '@/libs/env.helper'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


interface IAttribute{
    name: string,
    value: string,
    time: string,
}


type TProduct = {
    _id: string,
    product_name: string,
    description: string,
    slug: string,
    price: number,
    salePrice: number,
    stock: number,
    images: string[],
    attributes: IAttribute[],
    rating: number,
    reviewCount: number,
    tags: string[],
    isActive: boolean,
    bestSale: boolean,
    flashSale: boolean,
    promotion: string[],
    contentBlock: object[],
    category: object,
    brand: object,
    vendor: object
}


const ProductItem = ({product}:{product:TProduct}) => {
    const router = useRouter();
    return(
        <div 
        onClick={() => {
            router.push(`/products/${product.slug}`)
        }}
        className='w-[230px] h-[488px] bg-white p-3 shadow rounded-sm border-1 border-gray-200 cursor-pointer'>
            <div className='h-[250px] flex justify-center items-center'>
                <Image
                alt={product.product_name}
                src={product.images[0]}
                width={210}
                height={210}
                loading='lazy'
                />
            </div>
            <h1 className='font-bold pt-2 pb-2 text-gray-800'>{product.product_name}</h1>
            <div className='grid grid-cols-2 bg-gray-200 text-[12px] rounded-sm'>
                {product.tags.map((tag, index) => (
                    <button
                    key={index}
                    className=' text-gray-600 font-bold'
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <div className='flex flex-col pt-2 pb-2'>
                <span className='line-through text-gray-500'>
                    {product.price.toLocaleString()}₫
                </span>
                <div className='flex gap-x-3'>
                    <span className='text-red-500 font-bold'>
                        {product.salePrice.toLocaleString()}₫
                    </span>
                    <span className='flex items-center text-red-500 font-semibold text-[13px] border-1 border-red-500 px-1 bg-red-50 rounded-sm'>
                        -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </span>
                </div>   
            </div>
            <div className="flex items-center gap-x-1 text-yellow-500">
                <span className="font-semibold text-black">{product.rating.toFixed(1)}</span>
                <span>★</span>
                <span className="text-sm text-gray-600">(1 đánh giá)</span>
            </div>
        </div>
    )
}

export default function BestSaleBox() {
    //getall product
const fetchProduct = async(): Promise<TProduct[]> => {
    const response = await axios.get(`${env.API_URL}/products?bestSale=true`);
    //console.log('fetchProduct===>', response?.data?.data.products)
    return response?.data?.data.products;
}
    //khai báo state products
    const [products, setProducts] = useState<TProduct[]>([])

    useEffect(() => {
        const getProducts = async() => {
            try {
                const data = await fetchProduct();
                setProducts(data);
            } catch (error) {
                console.error('fetching error products', error);
            }
        };
        getProducts();
    },[]);

  return (
    <div className='bg-white mb-2 p-2'>
        <div className='flex justify-between'>
            <h1 className='font-bold text-2xl px-2 py-4 text-gray-900 hover:text-red-500 cursor-pointer'>Sản phẩm bán chạy</h1>
            <div className='flex px-2 py-4 items-center text-blue-500 font-bold'>
                <Link href={`/products?bestSale=true`}>Xem tất cả</Link>
            </div>
        </div>
        <div className='flex'>
            <Swiper
             modules={[Navigation, Pagination]} // Kích hoạt các module
             navigation
             pagination={{ clickable: true }}
             spaceBetween={5}
             slidesPerView={5}
             >               
            {products.map((p) => (
                <SwiperSlide 
                key={p._id}>
                    <ProductItem
                    key={p._id}
                    product={p}
                    />
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    </div>
  )
}