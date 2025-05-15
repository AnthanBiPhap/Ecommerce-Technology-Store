import { ICart, IOrder } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";
import { generateOrderNumber } from "@/libs/generateOrderNumber.helper";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


export default function InfoComponent({
  onNext
}: {
  onNext: () => void;
}) {
  const { user } = useAuthStore();
  //khai báo form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IOrder>({
    mode: "onChange",
  });

   // Theo dõi checkbox "Xuất hóa đơn"
   const [taxChecked, setTaxChecked] = useState(false);
   console.log('taxChecked==>',taxChecked);

  //khai báo state
  const [carts, setCarts] = useState<ICart | null>(null);
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
      //console.log('carts===>', JSON.stringify(data, null, 2));
      if(data) {
        console.log('carts items:', data.items); // Kiểm tra items
        setCarts(data);
      } 
      
    }
    getCarts(user?._id);
  },[user?._id]);
//----------------------END GET ALL CART-------------------------//

  const createOrder = async (values: IOrder): Promise<IOrder | undefined> => {
      // Thực hiện gọi API để thêm orders
      try {
        if(carts) {
          const response = await axiosClient.post(`${env.API_URL}/orders`, {
            ...values,
            tax: values.tax ?? 0,
            products: carts.items,
            totalAmount: carts.totalAmount,
            orderNumber: generateOrderNumber(),
            user: user?._id,
          });
          if (response.status === 201) {
            alert("Bạn đã nhập thông tin thành công!");
            console.log('orders ===>', response?.data?.data);
            onNext();
            return response?.data?.data;
          } else {
            alert("Thêm mới thông tin thất bại!");
          }
        }
      } catch (error) {
        console.error('createOrder is failed', error);
      }
  };

  return (
    <div className="w-[800px] h-full">
      <div className="bg-white p-2 rounded-sm w-full">
        <div className="flex flex-col w-full h-full justify-center items-center px-20 py-6 gap-y-1">
          {/* Thông tin khách hàng */}
          <form
            onSubmit={handleSubmit(createOrder)}
            className="space-y-4 flex flex-col w-full"
          >
            {/* Thông tin khách hàng */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="CustomerInfo" className="font-bold text-start">
                Thông tin khách mua hàng
              </label>
              {/* Gender: male | female */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="male"
                    {...register("shippingInfor.gender")}
                    className="accent-blue-600"
                  />
                  Anh
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="female"
                    {...register("shippingInfor.gender")}
                    className="accent-blue-600"
                  />
                  Chị
                </label>
              </div>
              {/* Ho Ten */}
              <div className="flex justify-between">
                <div className="flex flex-col w-72">
                  <input
                    id="fullName"
                    placeholder="Nhập họ và tên"
                    {...register("shippingInfor.recipientName")}
                    className="input border border-gray-700 px-4 py-2"
                  />
                  {errors.shippingInfor?.recipientName && (
                    <span className="text-red-500 text-[12px]">
                      {errors.shippingInfor?.recipientName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-72">
                  <input
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    {...register("shippingInfor.phone")}
                    className="input border border-gray-700 px-4 py-2"
                  />
                  {errors.shippingInfor?.phone && (
                    <span className="text-red-500 text-[12px]">
                      {errors.shippingInfor?.phone.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Địa chỉ */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="type" className="font-bold text-start">
                Chọn địa chỉ nhận hàng
              </label>
              <div className="px-6 py-3 bg-[#ECECEC] rounded-md w-full flex flex-col gap-y-4">
                <div className="flex justify-between">
                  <div className="flex flex-col w-66">
                    <input
                      id="street"
                      placeholder="Số nhà, tên đường"
                      {...register("shippingAddress.street")}
                      className="input border border-gray-700 px-4 py-2"
                    />
                    {errors.shippingAddress?.street && (
                      <span className="text-red-500 text-[12px]">
                        {errors.shippingAddress?.street.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-66">
                    <input
                      id="ward"
                      placeholder="Phường, Xã"
                      {...register("shippingAddress.ward")}
                      className="input border border-gray-700 px-4 py-2"
                    />
                    {errors.shippingAddress?.ward && (
                      <span className="text-red-500 text-[12px]">
                        {errors.shippingAddress?.ward.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col w-66">
                    <input
                      id="district"
                      placeholder="Quận, Huyện"
                      {...register("shippingAddress.district")}
                      className="input border border-gray-700 px-4 py-2"
                    />
                    {errors.shippingAddress?.district && (
                      <span className="text-red-500 text-[12px]">
                        {errors.shippingAddress?.district.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-66">
                    <input
                      id="city"
                      placeholder="Tỉnh, Thành phố"
                      {...register("shippingAddress.city")}
                      className="input border border-gray-700 px-4 py-2"
                    />
                    {errors.shippingAddress?.city && (
                      <span className="text-red-500 text-[12px]">
                        {errors.shippingAddress?.city.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Tax */}
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2 items-center">
                <input
                  type="checkbox"
                  id="hasTax"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTaxChecked(!taxChecked);
                    if (taxChecked === false) {
                      setValue("tax", 0); // nếu bỏ chọn, gán luôn giá trị 0
                    }
                  }}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="tax"
                  className="font-bold text-start"
                >
                  Xuất hóa đơn
                </label>
              </div>
              {taxChecked && (
                <div className="flex flex-1 flex-col">
                <input
                  id="tax"
                  placeholder="Mã số thuế"
                  type="number"
                  {...register("tax")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.tax && (
                  <span className="text-red-500 text-[12px]">
                    {errors.tax.message}
                  </span>
                )}
              </div>
              )}
            </div>
            {/* Chọn phương thức thanh toán */}
            <label htmlFor="type" className="font-bold text-start">
                Chọn phương thức thanh toán
              </label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="credit_card"
                    {...register("paymentMethod")}
                    className="accent-blue-600"
                  />
                  Credit Card
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="paypal"
                    {...register("paymentMethod")}
                    className="accent-blue-600"
                  />
                  Paypal
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="cod"
                    {...register("paymentMethod")}
                    className="accent-blue-600"
                  />
                  COD
                </label>
              </div>
                {/* Button Đặt hàng ngay */}
            <Button
            type="submit"
            className="w-full py-6 font-bold bg-red-500 rounded-sm hover:bg-red-600 cursor-pointer"
            >
            ĐẶT HÀNG NGAY
            </Button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
