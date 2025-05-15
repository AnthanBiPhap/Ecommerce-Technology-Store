import { create } from "zustand"
import type { ICart, ICartItem } from "@/app/types/types"
import { axiosClient } from "@/libs/axiosClient"
import { env } from "@/libs/env.helper"

interface CartState {
  carts: ICart | null
  itemQty: number
  fetchCart: (userId: string) => Promise<void>
  addToCart: (userId: string, productId: string, price: number, salePrice: number) => Promise<boolean>
  refreshCart: (userId: string) => Promise<void>
  updateCartItem: (userId: string, items: ICartItem[], totalAmount: number) => Promise<boolean>
  deleteCartItem: (userId: string, itemId: string) => Promise<boolean>
}

export const useCartStore = create<CartState>((set, get) => ({
  carts: null,
  itemQty: 0,

  //--------------------------- BEGIN GET ALL CARTS ---------------------------------//
  fetchCart: async (userId: string) => {
    if (!userId) return

    try {
      const response = await axiosClient.get(`${env.API_URL}/carts/user/${userId}`)
      if (response.status === 200) {
        const cartData = response?.data?.data
        set({
          carts: cartData,
          itemQty: cartData?.items?.length || 0,
        })
      }
    } catch (error) {
      console.error("fetching carts is failed", error)
    }
  },
  //--------------------------- END GET ALL CARTS ---------------------------------//

  //--------------------------- BEGIN ADD TO CARTS ---------------------------------//
  addToCart: async (userId: string, productId: string, price: number, salePrice: number) => {
    try {
      const response = await axiosClient.post(`${env.API_URL}/carts/user/${userId}`, {
        product: productId,
        quantity: 1,
        currentPrice: price,
        currentSalePrice: salePrice,
        totalAmount: salePrice,
      })

      if (response.status === 201) {
        // Refresh cart data after successful addition
        await get().fetchCart(userId)
        return true
      }
      return false
    } catch (error) {
      console.error("add to carts is failed", error)
      return false
    }
  },
  //--------------------------- END ADD TO CARTS ---------------------------------//

  //--------------------------- BEGIN UPDATE CARTS ITEMS ---------------------------------//
  updateCartItem: async (userId: string, items: ICartItem[], totalAmount: number) => {
    try {
      const cartItemsForUpload = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        currentPrice: item.currentPrice,
        currentSalePrice: item.currentSalePrice,
        totalAmount: item.totalAmount,
      }))

      const response = await axiosClient.put(`${env.API_URL}/carts/user/${userId}`, {
        items: cartItemsForUpload,
        totalAmount: totalAmount,
      })

      if (response.status === 200) {
        await get().fetchCart(userId)
        return true
      }
      return false
    } catch (error) {
      console.error("update cart item is failed", error)
      return false
    }
  },
  //--------------------------- END UPDATE CARTS ITEMS -------------------------------//

  //--------------------------- BEGIN DELETE CARTS ITEMS -------------------------------//
  deleteCartItem: async (userId: string, itemId: string) => {
    try {
      const response = await axiosClient.delete(`${env.API_URL}/carts/user/${userId}/item/${itemId}`)

      if (response.status === 200) {
        await get().fetchCart(userId)
        return true
      }
      return false
    } catch (error) {
      console.error("delete cart item is failed", error)
      return false
    }
  },

  refreshCart: async (userId: string) => {
    await get().fetchCart(userId)
  },
}))
//--------------------------- END DELETE CARTS ITEMS -------------------------------//