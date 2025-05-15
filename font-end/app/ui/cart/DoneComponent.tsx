'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { axiosClient } from '@/libs/axiosClient';
import { env } from '@/libs/env.helper';


interface IProduct {
  _id: string;
  product_name: string;
}

interface IProductVariant {
  _id: string;
  variantName: string;
  price: number;
  salePrice: number;
  images: string[];
  product: IProduct;
}

export interface IShippingAddress {
  fullName: string;
  gender: "male" | "female";
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country?: string;
}

interface IOrderItem {
  _id: string,
  productVariant: IProductVariant,
  quantity: number,
  currentPrice: number,
  currentSalePrice: number,
  totalAmount: number
}

export interface IOrder {
  orderNumber: string;
  products: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: IShippingAddress;
  status: string;
  notes: string;
  user: string;
}

export default function DoneComponent({resetCartStep}:{resetCartStep: ()=>void}) {
  const [order, setOrder] = useState<IOrder | null>(null);
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
    const getOrders = async() => {
      const data = await fetchOrders();
      if(data) setOrder(data);
    };

    getOrders();
  },[]);

  const orderDate = new Date().toLocaleDateString('vi-VN')

  return (
    <div className="w-[800px] h-full flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua sắm tại <span className="font-medium">GearVN</span>.</p>

        <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
          <p><span className="font-medium">Mã đơn hàng:</span> {order?.orderNumber}</p>
          <p><span className="font-medium">Ngày đặt:</span> {orderDate}</p>
          <p><span className="font-medium">Trạng thái:</span> Đang xử lý</p>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Xác nhận đơn hàng đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để biết thêm chi tiết.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/account/orders" onClick={resetCartStep}>
            <span className="inline-block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Xem đơn hàng của bạn
            </span>
          </Link>
          <Link href="/" onClick={resetCartStep}>
            <span className="inline-block w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
              Về trang chủ
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

