'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { env } from '@/libs/env.helper'
import Link from 'next/link'
import FlashSaleCD from './FlashSaleCD'


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
                    <span className='text-red-500 font-semibold text-[13px] border-1 border-red-500 px-1 bg-red-50 rounded-sm flex justify-center'>
                        -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </span>
                </div>   
            </div>
            <div className="flex items-center gap-x-1 text-yellow-500">
                <span className="font-semibold text-black">{product.rating.toFixed(1)}</span>
                <span>★</span>
                <span className="text-sm text-gray-600">(0 đánh giá)</span>
            </div>
        </div>
    )
}

export default function FlashSaleBox() {
    //getall product flashsale
const fetchProduct = async() => {
    const response = await axios.get(`${env.API_URL}/products?flashSale=true`);
    console.log('fetchProduct Flash Sale ===>', response?.data?.data.products)
    return response?.data?.data;
}
    //khai báo state products
    const [data, setData] = useState({
        products: [],
        pagination: {
            totalRecord: 0,
            limit: 20,
            page: 1
        }
    })

    useEffect(() => {
        const getProducts = async() => {
            try {
                const data = await fetchProduct();
                setData(data);
            } catch (error) {
                console.error('fetching error products', error);
            }
        };
        getProducts();
    },[]);
    console.log('totalRecord ===>', data?.pagination?.totalRecord);
  return (
    <div className='rounded-sm'>
        <div className='flex justify-between p-5 bg-blue-700 rounded-t-sm'>
            <div className='flex gap-x-3 items-center'>
                <span><FlashSaleCD /></span>
                <h1 className='text-2xl font-bold text-yellow-300'>FLASH SALE 10H MỖI NGÀY</h1>
            </div>
            <div className='w-10 h-10 px-1 py-1 bg-white rounded-sm font-bold flex items-center justify-center'>
                {data?.pagination?.totalRecord}
            </div>
        </div>
        <div className='grid grid-cols-1 bg-blue-500 mb-2 p-2 rounded-b-sm gap-y-2'>
            <div className='grid grid-cols-5 gap-x-3'>
                {data.products.map((p: TProduct) => (
                    <ProductItem
                    key={p._id}
                    product={p}
                    />
                ))}
            </div>
            <div className='flex justify-center'>
                <button className='px-4 py-1 bg-black text-white font-bold rounded-md'>
                    <Link href='/products?flashSale=true'>Xem tất cả sản phẩm</Link>
                </button>
            </div>
        </div>
    </div>
  )
}
