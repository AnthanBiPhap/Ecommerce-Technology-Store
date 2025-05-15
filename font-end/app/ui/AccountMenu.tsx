"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import LogoutConfirmDialog from "./LogoutConfirmDialog";


export default function AccountMenu() {
  const router = useRouter();
  const { user, clearTokens, clearUser } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLogout = () => {
    clearTokens();
    clearUser();
    router.push("/login");
  };

  //Khai báo component

  interface IAccountItem {
    title: string,
    icon: React.ReactNode,
    link: string,
    active: boolean
  }
  // Khai báo cho các phần từ trừ logout
  const AccountItem = ({ title, icon, link, active = false }: IAccountItem) => {
    return (
      <div
        className="px-4 text-[18px] flex items-center"
      >
        <Link
          href={link}
          className={`flex gap-x-3 group hover:text-red-500 ${
            active ? "font-bold text-red-500" : "text-gray-900"
          }`}
        >
          <span className="text-2xl flex items-center group-hover:text-red-500">
            {icon}
          </span>
          <p className="flex items-center group-hover:text-red-500">{title}</p>
        </Link>
      </div>
    );
  };
  //khai báo cho phần tử logout
  const AccountItemLogout = ({ title, icon, link, active = false }: IAccountItem) => {
    return (
      <div
        className="px-4 text-[18px] flex items-center"
      >
        <div
          className={`flex gap-x-3 group hover:text-red-500 ${
            active ? "font-bold text-red-500" : "text-gray-900"
          }`}
        >
          <span className="text-2xl flex items-center group-hover:text-red-500">
            {icon}
          </span>
          <p className="flex items-center group-hover:text-red-500">{title}</p>
        </div>
      </div>
    );
  };

  const accountArr = [
    {
      title: "Thông tin tài khoản",
      icon: <i className="bi bi-person-fill"></i>,
      link: "/account",
    },
    {
      title: "Sổ địa chỉ",
      icon: <i className="bi bi-geo-alt"></i>,
      link: "/account/address",
    },
    {
      title: "Quản lý đơn hàng",
      icon: (
        <div className="flex relative">
          <i className="bi bi-clipboard2"></i>
          <i
            className="bi bi-clock-fill bottom-0 end-0 rounded-circle absolute"
            style={{ fontSize: "0.75rem" }}
          ></i>
        </div>
      ),
      link: "/account/orders",
    },
    {
      title: "Đổi mật khẩu",
      icon: <i className="bi bi-lock"></i>,
      link: "/account/change-password",
    },
  ];

  if (user !== null) {
    return (
      <div className="grid grid-cols-1 w-[290px] h-[395px] bg-white text-[20px] rounded-md">
        <div className="flex gap-x-3 items-center px-4 py-1 border-b border-gray-300">
          <span className="grid relative w-[50px] h-[50px] bg-red-500">
            <Image
              alt={user?.fullName}
              src={user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              fill
              className="rounded-full"
            />
          </span>
          <p className="font-bold">{user?.fullName}</p>
        </div>
        {accountArr.map((account, index) => (
          <div 
          onClick={() => setCurrentIndex(index)}
          className="flex items-center"
          key={index}
          >
            <AccountItem
            active={currentIndex === index ? true : false}
            title={account.title}
            icon={account.icon}
            link={account.link}
            />
          </div>
        ))}
        {/* Đăng xuất */}
        <LogoutConfirmDialog onLogout={handleLogout}>
          <div 
           onSelect={(e) => e.preventDefault()} // ngăn Dropdown đóng
          className="flex items-center cursor-pointer"
          >
            <AccountItemLogout
              active={false}
              title="Đăng xuất"
              icon={<i className="bi bi-box-arrow-right"></i>}
              link= '#'
            />
          </div>
        </LogoutConfirmDialog>
      </div>
    );
  }
  return null;
};
