"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";
import StoreLocation from "@/app/ui/storeLocal/StoreLocation";

export default function Showroom() {
const [area, setArea] = useState("");
// Khai báo trỏ cuộn chuột
const handleScroll = () => {
    const section = document.getElementById("targetSection");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth", // Tạo hiệu ứng cuộn mượt mà
        block: "start", // Cuộn đến phần đầu của section
      });
    }
  };

const stores = [
  {
    area: "KHU VỰC MIỀN NAM",
    items: [
      {
        name : "HOÀNG HOA THÁM", 
        address: '78-80-82 Hoàng Hoa Thám, Phường 12, Quận Tân Bình', 
        hours: "8:00 - 21:00 | Thứ 2 - Chủ Nhật", 
        latitude: 10.79936155313872, 
        longitude: 106.6474674576721,
      },
      {
        name : "TRẦN HƯNG ĐẠO", 
        address: '1081 - 1083 Trần Hưng Đạo, Phường 5, Quận 5',
        hours: "8:00 - 21:00 | Thứ 2 - Chủ Nhật", 
        latitude: 10.753845102063663, 
        longitude: 106.67407608465582,
      }
    ],
  },
  {
    area: "KHU VỰC MIỀN BẮC",
    items: [
      {
        name : "THÁI HÀ", 
        address: '162 - 164 Thái Hà, Phường Trung Liệt, Đống Đa, Hà Nội.',
        hours: "8:00 - 21:00 | Thứ 2 - Chủ Nhật", 
        latitude: 21.012782369148812, 
        longitude: 105.82208046032574,
      },
    ],
  },
];

  return (
    <div className="flex flex-col items-center w-full bg-white">
      {/* Hero Section with Showroom Illustration */}
      <div className="relative w-full">
        <div className="relative w-full h-[400px]">
          <Image
            src="http://localhost:8889/uploads/showrooms/background_4303_png_860.png"
            alt="background-showrooms"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 text-white px-4">
          <h1 className="text-4xl font-bold mb-2">HỆ THỐNG SHOWROOM GEARVN</h1>
          <p className="mb-4">Địa điểm trải nghiệm và mua sắm thiết bị công nghệ cao cấp</p>
          <Button 
          onClick={handleScroll}
          className="bg-red-500 hover:bg-red-600 text-white rounded-md font-bold px-6 cursor-pointer">
            XEM NGAY
          </Button>
        </div>
      </div>

      {/* Region Selection Section */}
      <div className="w-full py-10 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[#003366] text-2xl font-bold text-center mb-8">CHỌN KHU VỰC CỦA BẠN</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Southern Region */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 flex justify-center">
                <Image
                  src="http://localhost:8889/uploads/showrooms/ecomerce_store.png"
                  alt="Southern Region Building"
                  width={200}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="bg-[#003366] text-white py-2 text-center font-bold">
                <button 
                onClick={() => {
                  setArea('KHU VỰC MIỀN NAM')
                }}
                className="cursor-pointer w-full"
                >
                  KHU VỰC MIỀN NAM
                </button>
              </div>
            </div>

            {/* Northern Region */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 flex justify-center">
                <Image
                  src="http://localhost:8889/uploads/showrooms/ecomerce_store.png"
                  alt="Northern Region Building"
                  width={200}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="bg-[#003366] text-white py-2 text-center font-bold">
                <button 
                onClick={() => {
                  setArea('KHU VỰC MIỀN BẮC');
                }}
                className="cursor-pointer w-full"
                >
                  KHU VỰC MIỀN BẮC
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Position Information Section */}
      <div id="targetSection" className="w-full flex flex-col gap-y-2">
        <div className="w-full mx-auto h-28 bg-red-500 flex gap-x-2 items-center justify-center">
          <MapPin 
          size={60} 
          className="text-white"
          />
          <p className="text-4xl text-white font-bold">{area}</p>
        </div>
        {area === 'KHU VỰC MIỀN BẮC' && stores.length > 0 && stores[1].items.map((item, index) => (
          <div
          key={index}
          >
            <StoreLocation 
            name={item.name}
            address={item.address}
            hours={item.hours}
            latitude={item.latitude}
            longitude={item.longitude}
            />
          </div>
        ))};

        {area === 'KHU VỰC MIỀN NAM' && stores.length > 0 && stores[0].items.map((item, index) => (
          <div
          key={index}
          >
            <StoreLocation 
            name={item.name}
            address={item.address}
            hours={item.hours}
            latitude={item.latitude}
            longitude={item.longitude}
            />
          </div>
        ))};
      </div>

      {/* Footer Border */}
      <div className="w-full border-t border-gray-300 mt-4"></div>
    </div>
  );
}
