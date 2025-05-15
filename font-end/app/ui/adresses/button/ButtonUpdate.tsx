"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";

const schema = yup
  .object({
    type: yup
      .string()
      .oneOf(["shipping", "billing"])
      .required("Shipping is required"),
    fullName: yup.string().required("Full Name is required"),
    phoneNumber: yup
      .string()
      .required("Phone Number is required")
      .matches(/^[0-9]+$/, "Phone number must be digits"),
    street: yup.string().required("Street is required"),
    ward: yup.string().required("Ward is required"),
    district: yup.string().required("District is required"),
    city: yup.string().required("City is required"),
    country: yup.string().required("Country is required"),
  })
  .required();

interface IAddressForm {
  type: "shipping" | "billing";
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

interface IAddress {
  _id: string;
  type: "shipping" | "billing";
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  isDefault: boolean;
  user: object;
}

export default function ButtonUpdate({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<IAddress | null>(null);
  //khai báo form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    
  } = useForm<IAddressForm>({ 
    resolver: yupResolver(schema),
    mode: "onChange"
  });
  //gọi API để đổ dữ liệu vào form trước khi edit
  const fetchAddress = async (): Promise<IAddress | undefined> => {
    try {
      const response = await axiosClient.get(`${env.API_URL}/addresses/${id}`);
      console.log('fetchAddress===>', response?.data)
      return response?.data?.data;
    } catch (error) {
      console.error("fetching adresses is failed", error);
    }
  };

  /* useEffect(() => {
    if (!id) return; // đợi user có dữ liệu
    const getAddress = async () => {
      const data = await fetchAddress();
      if (data) setAddress(data);
    };
    getAddress();
  }, [id]); */

  const updateAddress = async (
    values: IAddressForm
  ): Promise<IAddressForm | undefined> => {
    try {
      // Thực hiện gọi API để thêm địa chỉ
      const response = await axiosClient.put(
        `${env.API_URL}/addresses/${id}`,
        values
      );
      if (response.status === 200) {
        alert("Bạn đã cập nhật địa chỉ thành công!");
        setOpen(false);
        return response?.data;
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("update address failed", error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={async(isOpen: boolean) => {
          setOpen(isOpen);
          const data = await fetchAddress();
          if(data) setAddress(data);
          if (isOpen && address) {
            reset({
              type: address.type,
              fullName: address.fullName,
              phoneNumber: address.phoneNumber,
              street: address.street,
              ward: address.ward,
              district: address.district,
              city: address.city,
              country: address.country,
            });
          }
        }}
      >
        <DialogTrigger asChild>
          <span className="text-blue-500 cursor-pointer">Cập nhật</span>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="flex justify-center">
            <DialogTitle className="flex justify-center pb-4 border-b border-gray-300 font-bold text-blue-500">
              Cập nhật địa chỉ
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(updateAddress)}
            className="space-y-4 flex flex-col"
          >
            {/* Types: shipping | billing */}
            <div className="flex gap-x-5 items-center">
              <label htmlFor="type" className="font-bold w-[130px] text-start">
                Chọn loại địa chỉ
              </label>
              <select
                {...register("type")}
                className="flex-1 border border-gray-700 px-4 py-2"
              >
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            {/* fullName */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="fullName"
                className="font-bold w-[130px] text-start"
              >
                Full Name
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="fullName"
                  {...register("fullName")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-[12px]">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
            </div>
            {/* PhoneNumber */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="phoneNumber"
                className="font-bold w-[130px] text-start"
              >
                Phone Number
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-[12px]">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>
            {/* street */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="street"
                className="font-bold w-[130px] text-start"
              >
                Street
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="street"
                  {...register("street")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.street && (
                  <span className="text-red-500 text-[12px]">
                    {errors.street.message}
                  </span>
                )}
              </div>
            </div>
            {/* Ward */}
            <div className="flex gap-x-5 items-center">
              <label htmlFor="ward" className="font-bold w-[130px] text-start">
                Ward
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="ward"
                  {...register("ward")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.ward && (
                  <span className="text-red-500 text-[12px]">
                    {errors.ward.message}
                  </span>
                )}
              </div>
            </div>
            {/* District */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="district"
                className="font-bold w-[130px] text-start"
              >
                District
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="district"
                  {...register("district")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.district && (
                  <span className="text-red-500 text-[12px]">
                    {errors.district.message}
                  </span>
                )}
              </div>
            </div>
            {/* City */}
            <div className="flex gap-x-5 items-center">
              <label htmlFor="city" className="font-bold w-[130px] text-start">
                City
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="city"
                  {...register("city")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.city && (
                  <span className="text-red-500 text-[12px]">
                    {errors.city.message}
                  </span>
                )}
              </div>
            </div>
            {/* Country */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="country"
                className="font-bold w-[130px] text-start"
              >
                Country
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="country"
                  {...register("country")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.country && (
                  <span className="text-red-500 text-[12px]">
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="px-10 py-1 bg-blue-500 hover:bg-blue-600"
              >
                Cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
