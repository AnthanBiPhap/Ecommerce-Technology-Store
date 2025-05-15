"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosClient } from "@/libs/axiosClient";
import { env } from "@/libs/env.helper";
import axios from "axios";

interface IUserUpdateInfo {
  fullName: string,
  gender?: string,
  phone?: string,
  birthDay?: Date | string
}

export default function PersonalInfoForm() {
  const {user, tokens} = useAuthStore();
  //console.log('email===>',user?.email);
  //Khai báo form data
  const [formData, setFormData] = useState<IUserUpdateInfo>({
    fullName: user?.fullName ?? "",
    gender: user?.gender ?? "",
    phone: user?.phone ?? "",
    birthDay: user?.birthDay ?? "",
  });

  //khai báo dữ liệu cho select day, month, year
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => (i + 1).toString()),[]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => (i + 1).toString()),[]);
  const years = useMemo(() => Array.from({ length: 100 }, (_, i) => (1925 + i).toString()),[]);
  
  //gọi hàm handleChange đổ dữ liệu từ input vào formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //đổ dũ liệu birthday vào formData
  const [birthDate, setBirthDate] = useState({
    day: '',
    month: '',
    year: ''
  });

  useEffect(() => {
    const { day, month, year } = birthDate;
    if (day && month && year) {
      const birthDay = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, birthDay }));
    }
  }, [birthDate]);
  
  //gọi API update dự liệu từ form vào database
  const updateUser = async() => {
    try {
      const id = user?._id;
      //console.log('values, id===>', values, id);
      const response = await axios.put(`${env.API_URL}/users/${id}`, 
      {...formData},
      {
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`
        }
      }
    );
    if(response.status === 200) {
      alert('Cập nhật dữ liệu thành công');
      return response.data;
    }
    } catch (error) {
      console.log('fetching data is failed', error);
    }
  };
  

  //sử dụng useEffect để lấy dữ liệu về và lưu vào storage

  return (
    <div className="w-[900px] h-[395px] p-6 bg-white rounded-md shadow-md space-y-6">
      <h2 className="text-2xl font-bold">Thông tin tài khoản</h2>

      <div className="w-[580px] h-[286px] grid grid-rows-6 items-center">
        {/* Họ Tên */}
        <div className="flex gap-x-8 w-full">
          <Label 
          className="text-[16px] w-[150px] shrink-0 flex justify-end"
          htmlFor="fullName"
          >
            Họ Tên
          </Label>
          <Input
            className="flex-1 rounded-none border border-gray-700"
            id="fullName"
            name="fullName"
            placeholder={user?.fullName ?? "Họ và tên"}
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        {/* Giới tính */}
        <div className="flex gap-x-8 w-full">
          <Label
          className="text-[16px] w-[150px] shrink-0 flex justify-end"
          >Giới tính</Label>
          <RadioGroup
            className="flex gap-6"
            value={formData.gender}
            onValueChange={(value) =>
              setFormData(prev => ({ ...prev, gender: value }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male"
              className="border border-gray-700"
              />
              <Label htmlFor="nam">Nam</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female"
              className="border border-gray-700"
              />
              <Label htmlFor="nu">Nữ</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Số điện thoại */}
        <div className="flex gap-x-8 w-full">
          <Label 
          className="text-[16px] w-[150px] shrink-0 flex justify-end"
          htmlFor="phone">Số điện thoại</Label>
          <Input
            className="flex-1 rounded-none border border-gray-700"
            id="phone"
            name="phone"
            placeholder={user?.phone || 'số điện thoại'}
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="flex gap-x-8 w-full">
          <Label 
          className="text-[16px] w-[150px] shrink-0 flex justify-end"
          htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={user?.email}
            readOnly
            className="bg-gray-100 cursor-not-allowed rounded-none border border-gray-700"
          />
        </div>

        {/* Ngày sinh */}
        <div className="flex gap-x-8 w-full">
          <Label 
          className="text-[16px] w-[150px] shrink-0 flex justify-end"
          htmlFor="birthDay">Ngày sinh</Label>
          <div className="grid grid-cols-3 gap-4 w-full">
            <Select onValueChange={(value) => setBirthDate((prev) => ({...prev, day : value}))}>
              <SelectTrigger className="w-28 rounded-none border border-gray-700">
                <SelectValue placeholder="Ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="font-bold text-black text-[16px]">Ngày</SelectLabel>
                  <ScrollArea className="h-72 w-28">
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                  </ScrollArea>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setBirthDate((prev) => ({...prev, month : value}))}>
              <SelectTrigger className="w-28 rounded-none border border-gray-700">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="font-bold text-black text-[16px]">Tháng</SelectLabel>
                  <ScrollArea className="h-72 w-28">
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                  </ScrollArea>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setBirthDate((prev) => ({...prev, year: value}))}>
              <SelectTrigger className="w-28 rounded-none border border-gray-700">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="font-bold text-black text-[16px]">Năm</SelectLabel>
                  <ScrollArea className="h-72 w-28">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                  </ScrollArea>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>    
        {/* Nút lưu */}
        <div className="flex gap-x-8 w-full">
          <div className="text-[16px] w-[150px] shrink-0 flex justify-end"></div>
          <Button
          onClick={updateUser} 
          className="px-4 py-2 font-bold bg-red-500 rounded-none hover:bg-red-600 cursor-pointer">
            LƯU THÔNG TIN
          </Button>
        </div>
      </div>
    </div>
  );
}
