import React from 'react'
import AddressBox from '@/app/ui/adresses/AddressBox';
import ButtonAdd from '@/app/ui/adresses/button/ButtonAdd';

export default function AddressPage() {
  
  return (
    <div className="w-[900px] h-[395px] bg-white rounded-md shadow-md">
      <div className='flex justify-between px-6 pt-7 pb-6 border-b border-gray-300'>
        <h2 className="text-2xl font-bold">Sổ địa chỉ</h2>
        <ButtonAdd />
      </div>
      <div className='flex flex-col gap-y-3'>
        <AddressBox />
      </div>
    </div>
  )
}
