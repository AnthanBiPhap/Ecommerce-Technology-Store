"use client";

import { useEffect, useState } from "react";
import ClickBuyDialog from "@/app/ui/cart/ClickBuyDialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";
import { ICart } from "@/app/types/types";
import { useCartStore } from "@/stores/useCartStore";

interface BuyButtonProps {
  productId: string;
  price: number;
  salePrice: number;
}

export default function BuyButton({
  productId,
  price,
  salePrice,
}: BuyButtonProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuthStore();
  const {carts, fetchCart, addToCart} = useCartStore();


  //Fetch carts khi mà carts hoặc user thay đổi
  useEffect(() => {
    if(user?._id) {
      fetchCart(user._id);
    }
  },[user?._id, fetchCart])

  const handleAddToCart = async () => {
    if (!user) {
      // Open dialog if not logged in
      setOpenDialog(true);
    } else {
      //kiểm tra xem đã có sản phẩm đó trong giỏ hàng hay chưa
      if (carts && carts.items.some((item: any) => productId === item.product._id)) {
        alert(
          "Sản phẩm này đã có trong giỏ hàng, bạn có thể kiểm tra giỏ hàng để biết thêm chi tiết"
        );
      } else {
        //Không thì sẽ thêm sản phẩm vào giỏ hàng
        const success = await addToCart(user._id, productId, price, salePrice)
        if(success) {
          alert("Bạn đã thêm vào giỏ hàng thành công")
        }
      }
    };
  };

  return (
    <div className="mt-8">
      <button
        className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300 cursor-pointer"
        onClick={handleAddToCart}
      >
        <h1 className="text-[15px]">MUA NGAY</h1>
        <h2 className="text-[10px]">Giao tận nơi hoặc nhận tại cửa hàng</h2>
      </button>

      <ClickBuyDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
