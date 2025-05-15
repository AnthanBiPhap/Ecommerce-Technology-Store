'use client'

import { IOrder } from '@/app/types/types';
import { axiosClient } from '@/libs/axiosClient';
import { env } from '@/libs/env.helper';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link'
import { useEffect, useState } from 'react';


const statusColorMap: Record<string, string> = {
  received: 'text-gray-500',
  processing: 'text-blue-500',
  shipping: 'text-orange-500',
  delivered: 'text-green-600'
}

const statusLabelMap: Record<string, string> = {
  received: 'Đã tiếp nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const {user} = useAuthStore();

  //fetch dữ liệu từ orders về
  const fetchOrders = async() => {
    try {
      const response = await axiosClient.get(`${env.API_URL}/orders/user/${user?._id}`);
      if(response.status === 200) {
        console.log('order===>', response?.data?.data)
        return response?.data?.data;
      };
    } catch (error) {
      console.error('fetching order by id is failed', error)
    }
  };
  
  useEffect(() => {
    if(user?._id) {
      const getOrders = async() => {
        const data = await fetchOrders();
        if(data) setOrders(data);
      };
    
    getOrders();
  }},[user?._id]);
  //console.log('orders===>', orders)

  const orderDate = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="w-[900px] min-h-[395px] max-h-full bg-white rounded-md shadow-md">
      <div className='flex justify-between px-6 pt-7 pb-6 border-b border-gray-300'>
        <h2 className="text-2xl font-bold">Đơn hàng của bạn</h2>
      </div>

      {orders && orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders !== null && orders.map((order) => (
            <Link
              href={`/account/orders/${order._id}`}
              key={order._id}
              className="block border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng: <span className="font-medium">{order._id}</span></p>
                  <p className="text-sm text-gray-500">Ngày đặt: {orderDate}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${statusColorMap[order.status]}`}>
                    {statusLabelMap[order.status]}
                  </p>
                  <p className="text-base font-semibold text-gray-800">{order.totalAmount.toLocaleString()}₫</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

