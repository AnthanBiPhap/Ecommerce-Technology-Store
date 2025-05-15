'use client'

import React, { useEffect, useState } from 'react'
import CreditCardPayment from '../payment/CreditCardPayment'
import { Button } from '@/components/ui/button'
import { axiosClient } from '@/libs/axiosClient';
import { env } from '@/libs/env.helper';
import { useAuthStore } from '@/stores/useAuthStore';
import PaypalPayment from '../payment/PaypalPayment';
import CodPayment from '../payment/CodPayment';
import Image from 'next/image';
import { IOrder } from '@/app/types/types';


export default function PaymentComponent({ onNext }: { onNext: () => void }) {
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null); //Dữ liệu từ các component con
  const {user} = useAuthStore();

  //fetch dữ liệu từ orders về
  const fetchOrders = async() => {
    try {
      const response = await axiosClient.get(`${env.API_URL}/orders/user/${user?._id}`);
      if(response.status === 200) {
        //console.log('order===>', response?.data?.data)
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

  //----------------------BEGIN KHAI BÁO ON HANDLE CHECK OUT-----------------//
  //Bước 1: gọi các hàm con (create payment, update orderPaymentStatus, delete carts)
    //1.1 Tạo collection payment
    const createPayment = async() => {
      try {
        const order = orders && orders[0];
        if(!order || !paymentData) return alert('Thông tin thanh toán chưa đầy đủ')
        const response = await axiosClient.post(`${env.API_URL}/payments`, {
          amount: order?.totalAmount,
          method: paymentData.type,
          status: "completed",
          transactionId: paymentData.transactionId,
          gateway: paymentData.gateway,
          metadata: paymentData.metadata,
          order: order._id,
          user: user?._id
        });
        if(response.status === 201) {
          console.log('create payment thành công')
        }
      } catch (error) {
        console.error('create payment is failed', error);
      }
    };
    //1.2 update order.paymentstatus = paid
    const updatePaymentStatusOrder = async() => {
      try {
        const order = orders && orders[0];
        if(!order) return alert('Không có đơn hàng nào');
        const response = await axiosClient.put(`${env.API_URL}/orders/${order._id}`,{
          paymentStatus: "paid"
        });
        if(response.status === 200) {
          console.log('update payment status thành công')
        }
      } catch (error) {
        console.error('update is failed', error);
      }
    }
    //1.3 Delete giỏ hàng
    const deleteCarts = async() => {
      try {
        const response = await axiosClient.delete(`${env.API_URL}/carts/user/${user?._id}`);
        if(response.status === 200) {
          console.log('Xóa giỏ hàng thành công');
        }
      } catch (error) {
        console.error('delete Cart failed', error);
      }
    }
  //Bước 2: Gọi hàm onHandleCheckOut
  const onHandleCheckOut = async() => {
    try {
      const order = orders && orders[0];
      if (!order) return alert("Không có đơn hàng nào");

      // Trường hợp COD, không cần thanh toán
      if (order.paymentMethod === "cod") {
        await deleteCarts();
        alert("Bạn đã đặt hàng thành công");
        onNext(); // Chuyển trang
        return;
      };

      // Trường hợp thanh toán trực tuyến (Credit Card / Paypal)
      if (!paymentData) {
        return alert("Thông tin thanh toán chưa đầy đủ");
      };
       //1.1 Tạo collection payment
       await createPayment();
       //1.2 update order.paymentstatus = paid
       await updatePaymentStatusOrder();
       //1.3 Delete giỏ hàng
       await deleteCarts();
       // thông báo
       alert('Bạn đã đặt hàng thành công');
       // chuyển trang
       onNext();
    } catch (error) {
      console.error('delete Cart failed', error);
      alert('Bạn đặt hàng thất bại, vui lòng thử lại');
    }
  }
  //----------------------END KHAI BÁO ON HANDLE CHECK OUT-----------------//

  return (
    <div className="w-[800px] h-full">
        <div className="bg-white p-2 rounded-sm w-full flex flex-col gap-y-5">
          {orders && orders[0]?.paymentMethod === 'credit_card' && <CreditCardPayment onPaymentSuccess={setPaymentData} />}
          {orders && orders[0]?.paymentMethod === 'paypal' && <PaypalPayment onPaymentSuccess={setPaymentData} />}
          {orders && orders[0]?.paymentMethod === 'cod' && <CodPayment />}
          
          {/* Thông tin giỏ hàng hiện tại cần thanh toán */}
          <div className='bg-red-50 p-5 rounded-xl'>
            <h1 className='font-bold'>DANH SÁCH SẢN PHẨM CẦN THANH TOÁN</h1>
            {orders && orders[0]?.products && orders[0].products.length > 0 && orders[0].products.map((p) => (
              <div className='flex justify-between my-3' key={p._id}>
                <div className='flex gap-x-3'>
                  <Image 
                  alt={p.product.product_name}
                  src={p.product.images[0]}
                  width={100}
                  height={100}
                  className="p-2 border border-gray-200"
                  />
                  <div className="flex flex-col gap-y-1 p-1">
                  <p className='w-80'>
                    {p.product.product_name}
                  </p>
                  
                  <span className='text-red-500 font-bold'>
                  {p.product.salePrice && p.currentSalePrice.toLocaleString()}₫
                  </span>
                  <span className='line-through text-gray-500 text-[12px]'>
                  {p.product.price && p.currentPrice.toLocaleString()}₫
                  </span>
                  </div>
                  <p className='text-xl text-gray-700 flex items-center'>
                    X
                  </p>
                  <p className='text-2xl flex items-center'>
                    {p.quantity}
                  </p>
                  <p className='text-xl text-gray-700 flex items-center'>
                    =
                  </p>          
                </div>
                <div className="flex flex-col gap-y-1 p-1">
                  <span className='text-red-500 font-bold text-xl flex justify-end'>
                  {p.product.salePrice && (p.currentSalePrice*p.quantity).toLocaleString()}₫
                  </span>
                  <span className='line-through text-gray-500 flex justify-end'>
                  {p.product.price && (p.currentPrice*p.quantity).toLocaleString()}₫
                  </span>
                </div>
              </div>
            ))}
            {/* Tính tổng tiền */}
            <div className="w-full flex justify-between py-6">
              <p className="font-bold text-xl">Tổng tiền</p>
              <p className="text-red-500 font-bold text-2xl flex">{orders && orders[0]?.totalAmount.toLocaleString()}₫</p>
            </div>
          </div>

          {/* Button Đặt hàng ngay */}
          <Button
            type="submit"
            className="w-full py-6 font-bold bg-red-500 rounded-sm hover:bg-red-600 cursor-pointer"
            onClick={onHandleCheckOut}
            >
            HOÀN TẤT ĐẶT HÀNG
          </Button>
        </div>
    </div>
  )
}
