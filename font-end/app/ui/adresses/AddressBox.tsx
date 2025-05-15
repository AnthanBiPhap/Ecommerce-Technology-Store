'use client'

import React, { useEffect, useState } from 'react'
import { axiosClient } from '@/libs/axiosClient';
import { useAuthStore } from '@/stores/useAuthStore';
import { env } from '@/libs/env.helper';
import ButtonUpdate from './button/ButtonUpdate';

interface IAddress {
   _id: string,
    type: string,
    fullName: string,
    phoneNumber: string,
    street: string,
    ward: string,
    district: string,
    city: string,
    country: string,
    isDefault: boolean,
    user: object
  }

export default function AddressBox() {
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const {user} = useAuthStore();

    //-------------------//BEGIN GET ALL ADDRESS//--------------------//
    //fetch dữ liệu từ adresses về
      const fetchAddresses = async():Promise<IAddress[] | undefined> => {
        try {
          const response = await axiosClient.get(`${env.API_URL}/addresses/user/${user?._id}`);
          return response?.data?.data;
        } catch (error) {
          console.error('fetching adresses is failed', error);
        }
      }
    
      useEffect(() => {
        if (!user?._id) return; // đợi user có dữ liệu
        const getAddresses = async() => {
          const data = await fetchAddresses();
          if(data) setAddresses(data);
        }
        getAddresses();
      },[user?._id]);
    //-------------------//END GET ALL ADDRESS//--------------------//

    //-------------------//BEGIN DELETE ADDRESS//--------------------//

      //gọi API delete address
      const deleteAddress = async(id: string) => {
        try {
          const response = await axiosClient.delete(`${env.API_URL}/addresses/${id}`);
          if(response.status === 200) {
            alert('xóa địa chỉ thành công!');
            return response.data;
          } else {
            alert('xóa địa chỉ thất bại!')
          }
        } catch (error) {
          console.error('delete address is failed', error);
        }
      }
      //gọi hàm xóa address và update lại dữ liệu
      const handleDelete = async (id: string) => {
        const response = await deleteAddress(id);
        if (response) {
          const updated = await fetchAddresses();
          if (updated) setAddresses(updated);
        }
      }

      //-------------------//END DELETE ADDRESS//--------------------//


      //-------------------//BEGIN ISDEFAULT = TRUE//--------------------//

      //gọi API update isDeafault = true
      const updateIsDeafault = async(id: string) => {
        try {
          const response = await axiosClient.put(`${env.API_URL}/addresses/isDefault/${id}`);
          if(response.status === 200) {
            alert('Đặt làm mạc định thành công');
            return response.data;
          }
        } catch (error) {
          console.error('update isDeafault is failed', error)
        }
      }
      //gọi hàm update isDeafault = true
      const handleIsDefault = async(id: string) => {
        const response = await updateIsDeafault(id);
        if(response) {
          const update = await fetchAddresses();
          if(update) setAddresses(update);
        }
      };
      //-------------------//END ISDEFAULT = TRUE//--------------------//
    
      const AddressItem = (
        {
          id,
          values,
          onHandleDelete,
          onHandleIsDefault
        }:{
          id: string,
          values : IAddress, 
          onHandleDelete: () => void,
          onHandleIsDefault: () => void
        }
        ) => {
        let className = 'border border-gray-300 px-2 py-1 rounded-sm text-center text-gray-300 cursor-pointer';
        if(values.isDefault) {
          className = 'border border-red-500 px-2 py-1 rounded-sm text-center text-red-500 cursor-pointer'
        }

        return (
          <div className='w-full flex justify-between px-6 py-1'>
            <div>
              <div className='flex'>
                <span 
                className={className}
                onClick={onHandleIsDefault}
                >Mạc định</span>
                <span className='flex font-bold items-center px-3 border-r border-gray-500'>{values.fullName}</span>
                <span className='flex items-center px-3'>{values.phoneNumber}</span>
              </div>
              <div className='flex'>
                <span className='text-gray-600'>{`${values.street}, ${values.ward}, ${values.district}, ${values.city}, ${values.country}`}</span>
              </div>
            </div>
            <div className='flex gap-x-2'>
              <ButtonUpdate id={id} />
              <span 
              onClick={onHandleDelete}
              className='text-red-500 cursor-pointer'>Xóa</span>
            </div>
          </div>
        )
      }

  return (
    <div className='flex flex-col gap-y-3'>
      {addresses.map((a) => (
        <AddressItem 
        key={a._id}
        id={a._id}
        values={a}
        onHandleDelete={() => {handleDelete(a._id)}}
        onHandleIsDefault={() => {handleIsDefault(a._id)}}
        />
      ))}
    </div>
  )
}
