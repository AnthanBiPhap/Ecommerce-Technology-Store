import ProductBox from '@/app/ui/ProductBox'
import TechBoxMedium from '@/app/ui/techNew/TechBoxMedium'
import React from 'react'


export default function page() {
  return (
    <div className='flex justify-center p-2 bg-gray-100'>
        <div className='grid grid-cols-1 w-[1200px] gap-y-2'>
            <TechBoxMedium />
            <ProductBox
            title='Sản Phẩm bán chạy'
            type='bestsale'
            />
        </div>
    </div>
  )
}
