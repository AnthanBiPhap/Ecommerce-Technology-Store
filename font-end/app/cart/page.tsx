"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CreditCard, IdCard, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";
import { useAuthStore } from "@/stores/useAuthStore";
import CartComponent from "../ui/cart/CartComponent";
import InfoComponent from "../ui/cart/InfoComponent";
import PaymentComponent from "../ui/cart/PaymentComponent";
import DoneComponent from "../ui/cart/DoneComponent";


interface IProduct {
  _id: string;
  product_name: string;
  price: number;
  salePrice: number;
  images: string[];
}

interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
  currentPrice: number;
  currentSalePrice: number;
  totalAmount: number;
}

interface ICart {
  _id: string;
  items: ICartItem[];
  totalAmount: number;
  user: string
}

export default function CartPage() {
  const [step, setStep] = useState<"cart" | "info" | "payment" | "done">("cart"); 
  // lưu vào localstorage để khi f5 thì vẩn ở bước hiện tại của giỏ hàng
  // Lấy giá trị từ localStorage sau khi mount
  useEffect(() => {
    const savedStep = localStorage.getItem("cartStep") as "cart" | "info" | "payment" | "done";
    if (savedStep) setStep(savedStep);
}, []);

  // Cập nhật localStorage khi step thay đổi
  useEffect(() => {
    localStorage.setItem("cartStep", step);
  }, [step]);
  // Hàm xóa step khỏi localStorage
  const resetCartStep = () => {
    localStorage.removeItem("cartStep");
    setStep("cart");
  }

  const {user} = useAuthStore();
  const [carts, setCarts] = useState<ICart | null>(null);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  console.log('cartItems===>', cartItems);


  //----------------------BEGIN GET ALL CART-------------------------//
  const fetchCarts = async(userId: string) => {
    try {
      const response = await axiosClient.get(`${env.API_URL}/carts/user/${userId}`);
      if(response.status === 200) {
        return response?.data?.data;
      }
    } catch (error) {
      console.error('fetching carts is failed', error);
    }
  }
  useEffect(() => {
    if(user?._id === undefined) return;
    const getCarts = async(userId: string) => {
      const data = await fetchCarts(userId);
      console.log('carts===>', JSON.stringify(data, null, 2));
      if(data) {
        console.log('carts items:', data.items); // Kiểm tra items
        setCarts(data);
      } 
      
    }
    getCarts(user?._id);
  },[user?._id]);

  useEffect(() => {
    if (carts?.items) {
      setCartItems(carts.items);
      setTotalAmount(carts.totalAmount);
    }
  }, [carts]);

  
  return (
    <>
    <div className="flex justify-center bg-gray-100">
      {/* Mua thêm sản phẩm khác */}
      <div className="w-[800px] h-full">
        <div className="text-blue-500 pr-2 py-4 px-4">
          <Link href={'/'}>{`< Mua thêm sản phẩm khác`}</Link>
        </div>
        {/* Navigation cart */}
        
        <div className="bg-white p-2 rounded-sm">
          <div className="flex w-full h-22 bg-red-50 justify-center items-center gap-x-18">
            <div
            key="cart"
            className="flex flex-col gap-y-1 justify-center items-center cursor-pointer">
              <span className={step === "cart" ? "text-red-500 font-bold" : "text-gray-600"}><ShoppingCart /></span>
              <span className={step === "cart" ? "text-red-500 font-bold" : "text-gray-600"}>Giỏ hàng</span>
            </div>
            <div 
            key="info"
            className="flex flex-col gap-y-1 justify-center items-center cursor-pointer">
              <span className={step === "info" ? "text-red-500 font-bold" : "text-gray-600"}><IdCard /></span>
              <span className={step === "info" ? "text-red-500 font-bold" : "text-gray-600"}>Thông tin đặt hàng</span>
            </div>
            <div
            key="payment"
            className="flex flex-col gap-y-1 justify-center items-center cursor-pointer">
              <span className={step === "payment" ? "text-red-500 font-bold" : "text-gray-600"}><CreditCard /></span>
              <span className={step === "payment" ? "text-red-500 font-bold" : "text-gray-600"}>Thanh toán</span>
            </div>
            <div 
            key="done"
            className="flex flex-col gap-y-1 justify-center items-center cursor-pointer">
              <span className={step === "done" ? "text-red-500 font-bold" : "text-gray-600"}><ShieldCheck /></span>
              <span className={step === "done" ? "text-red-500 font-bold" : "text-gray-600"}>Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-center bg-gray-100 pb-6">
      {/* Cart content */}
      <AnimatePresence mode="wait">
      {step === "cart" && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <CartComponent onNext={() => setStep("info")} />
            </motion.div>
          )}

          {step === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <InfoComponent onNext={() => setStep("payment")} />
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <PaymentComponent onNext={() => setStep("done")} />
            </motion.div>
          )}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <DoneComponent resetCartStep={resetCartStep} />
            </motion.div>
          )}
      </AnimatePresence>
    </div>      
    </>
  );
}

