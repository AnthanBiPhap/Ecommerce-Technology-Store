"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { ICart, ICartItem } from "@/app/types/types";



export default function CartComponent({ onNext }: { onNext: () => void }) {
  const {user} = useAuthStore();
  const {carts, fetchCart, itemQty} = useCartStore();
    
    
  //fetch carts về khi carts hoặc user thay đổi
  useEffect(() => {
    if (user?._id) {
      fetchCart(user._id);
    }
  }, [user?._id, fetchCart]);

  //Hàm tăng sản phẩm
    const handleIncreaseQty = async(itemId: string) => {
      if(!user?._id || !carts) return;
      const updateCartItems = carts.items.map((item) => {
        if(item._id === itemId) {
          const newQuantity = item.quantity + 1;
          const newTotalAmount = item.product.salePrice * newQuantity;
          console.log('newQuantity, newTotalAmount===>', newQuantity, newTotalAmount);
          return {...item, quantity: newQuantity, totalAmount: newTotalAmount}
        }
        return item;
      });
      const totalAmount = updateCartItems.reduce((sum,item)=> sum + item.totalAmount, 0);
      await updateCart(updateCartItems, totalAmount);
      }
      //Hàm giảm sản phẩm
      const handleDecreaseQty = async(itemId: string) => {
        if(!user?._id || !carts) return;
        const updateCartItems = carts.items.map((item) => {
          if(item._id === itemId) {
            const newQuantity = item.quantity > 1 ? item.quantity -1 : 1;
            const newTotalAmount = item.product.salePrice * newQuantity;
            console.log('newQuantity, newTotalAmount===>', newQuantity, newTotalAmount);
            return {...item, quantity: newQuantity, totalAmount: newTotalAmount}
          }
          return item;
      });
      const totalAmount = updateCartItems.reduce((sum,item)=> sum + item.totalAmount, 0);
      await updateCart(updateCartItems, totalAmount);
      }
      //Xóa sản phẩm
      //Gọi API delete item
      const deleteItem = async(itemId: string) => {
        try {
          const response = await axiosClient.delete(`${env.API_URL}/carts/user/${user?._id}/item/${itemId}`);
          if(response.status === 200) {
            alert('Xóa sản phẩm thành công');
            return response.data;
          } else {
            alert('Xóa sản phẩm thất bại')
          }
        } catch (error) {
          console.error('delete cartitem is failed');
        }
      }
      //gọi hàm xóa sản phẩm
      const handleDelete = async(itemId: string) => {
        const response = await deleteItem(itemId);
        if(response && user?._id) {
          //refresh carts
          fetchCart(user._id);
        }
      }
      //----------------------END CART ITEMS-----------------------------//

      //----------------------BEGIN UPDATE CARD FOLOW CARDITEM-------------------------//
      const updateCart = async(items: ICartItem[], totalAmount: number): Promise<ICart | undefined> => {
        if(!user?._id) return;
        // Setting lại dữ liệu cart items ---> truyền vào carts
        const cartItemsForUpload = items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          currentPrice: item.currentPrice,
          currentSalePrice: item.currentSalePrice,
          totalAmount: item.totalAmount,
        }));
        //update cart
        const response = await axiosClient.put(`${env.API_URL}/carts/user/${user?._id}`, {
            items: cartItemsForUpload,
            totalAmount: totalAmount
        })
        if(response.status === 200) {
          console.log('update carts is successful');
          //refresh carts
          fetchCart(user._id);
          return response.data;
        } else {
          console.log('update carts is failed');
        }
      }
    
      //----------------------END UPDATE CARD FOLOW CARDITEM-------------------------//

      //Gọi handleCheckout
      const handleCheckout = async() => {
        if(!user?._id || !carts) return;
        if(carts && carts.items.length > 0) {
          alert("Đăng ký thông tin để nhận hàng");
          onNext();
        } else {
          alert("Mua hàng thất bại, mời bạn kiểm tra lại giỏ hàng");
        }
        
      }

  return (
    <div className="w-[800px] h-full">
        {/* Cart Content */}
        <div className="bg-white p-2 rounded-sm">
          <div className="flex flex-col w-full h-full justify-center items-center p-6 gap-y-1">
            {/* Danh sách sản phẩm */}
            <div className="border-b border-gray-300 w-full flex flex-col gap-y-6 pb-6">
            {carts && carts.items && carts.items.length > 0 ? (
              carts.items.map((item, index) => (
              <div 
              key={index} 
              className="w-full flex justify-between">
                <div className="flex gap-x-1">
                  <div
                  className="flex flex-col gap-y-1 justify-center items-center p-1"
                  
                  >
                    <Image 
                    alt={item.product.product_name}
                    src={item.product.images[0]}
                    width={100}
                    height={100}
                    className="p-2 border border-gray-200"
                    />
                    <p 
                    onClick={() => {
                      handleDelete(item._id);
                    }}
                    className="text-gray-500 flex gap-x-1 cursor-pointer hover:text-red-500">
                      <span><Trash2 style={{width: 12}} /></span> Xóa
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1 p-1">
                    <span className="font-bold">
                      {item.product.product_name}
                    </span>
                    <span>
                      <p className="text-[14px] font-bold">Khuyến mãi kèm theo</p>
                      <ul className="list-disc text-[12px] pl-4 text-gray-700">
                        <li>Giảm ngay 300.000đ khi mua thêm RAM.</li>
                        <li>Giảm ngay 200.000đ khi nâng cấp SSD.</li>
                        <li>Giảm ngay 300.000đ khi mua Microsoft Office kèm PC.</li>
                      </ul>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 p-1">
                  <span className='text-red-500 font-bold text-xl flex justify-end'>
                  {item.product.salePrice && item.product.salePrice.toLocaleString()}₫
                  </span>
                  <span className='line-through text-gray-500 flex justify-end'>
                  {item.product.price && item.product.price.toLocaleString()}₫
                  </span>
                  <span className="flex mt-2">
                    <p 
                    onClick={() => {
                      handleDecreaseQty(item._id);
                    }}
                    className="flex w-8 h-8 border border-gray-300 justify-center items-center rounded-l-sm cursor-pointer"
                    >-
                    </p>
                    <p 
                    className="flex w-16 h-8 border border-gray-300 justify-center items-center font-bold"
                    >{item.quantity}
                    </p>
                    <p
                    onClick={() => {
                      handleIncreaseQty(item._id);
                    }}
                    className="flex w-8 h-8 border border-gray-300 justify-center items-center rounded-r-sm cursor-pointer"
                    >+
                    </p>
                  </span>
                </div>
              </div>
              ))
            ):(
              <p>Không có sản phẩm nào trong giỏ hàng</p>
            )}
            </div>
            {/* Tính tổng tiền */}
            <div className="w-full flex justify-between py-6">
              <p className="font-bold text-xl">Tổng tiền</p>
              <p className="text-red-500 font-bold text-2xl flex">{carts ? carts.totalAmount.toLocaleString() : 0}₫</p>
            </div>
            {/* Button Đặt hàng ngay */}
            <Button
            onClick={handleCheckout}
            type="button"
            className="w-full py-6 font-bold bg-red-500 rounded-sm hover:bg-red-600 cursor-pointer"
            >
            ĐẶT HÀNG NGAY
            </Button>
          </div>
        </div>
      </div>
  )
}
