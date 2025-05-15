"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";
import { useAuthStore } from "@/stores/useAuthStore";

const schema = yup
  .object({
    type: yup
      .string()
      .oneOf(["shipping", "billing"])
      .required("Shipping is required"),
    fullName: yup.string().required("Full Name is required"),
    phoneNumber: yup
      .string()
      .min(10)
      .max(12)
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

export default function ButtonAdd() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  //khai báo form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddressForm>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const createAddress = async (
    values: IAddressForm
  ): Promise<IAddressForm | undefined> => {
    try {
      // Thực hiện gọi API để thêm địa chỉ
      const response = await axiosClient.post(`${env.API_URL}/addresses`, {
        ...values,
        isDefault: false,
        user: user?._id,
      });
      if (response.status === 201) {
        alert("Bạn đã thêm mới địa chỉ thành công!");
        setOpen(false);
        return response?.data?.data;
      } else {
        alert("Thêm mới thất bại!");
      }
    } catch (error) {
      console.error("create new address failed", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="px-4 py-2 font-bold bg-red-500 rounded-none hover:bg-red-600 cursor-pointer"
          >
            Thêm địa chỉ mới
          </Button>
        </DialogTrigger>

        <DialogContent aria-describedby={undefined}>
          <DialogHeader className="flex justify-center">
            <DialogTitle className="flex justify-center pb-4 border-b border-gray-300 font-bold text-red-500">
              Thêm địa chỉ mới
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(createAddress)}
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
                  <span className="text-red-500 text-[12px]">{errors.fullName.message}</span>
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
                  <span className="text-red-500 text-[12px]">{errors.street.message}</span>
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
                  <span className="text-red-500 text-[12px]">{errors.ward.message}</span>
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
                  <span className="text-red-500 text-[12px]">{errors.district.message}</span>
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
                  <span className="text-red-500 text-[12px]">{errors.city.message}</span>
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
                  <span className="text-red-500 text-[12px]">{errors.country.message}</span>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="px-10 py-1 bg-red-500 hover:bg-red-600"
              >
                Lưu địa chỉ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
