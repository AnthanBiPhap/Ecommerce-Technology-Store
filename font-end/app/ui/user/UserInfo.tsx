'use client'

import React from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from "../../../stores/useAuthStore";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Hand, LogOut, UserRoundPen } from 'lucide-react';
import IconHeader from '../IconHeader';
import LogoutConfirmDialog from '../LogoutConfirmDialog';

export default function UserInfo() {
  const router = useRouter();
  //Profile Staff
  const { user, clearTokens, clearUser } = useAuthStore();

  const handleLogout = () => {
    clearTokens();
    clearUser();
    router.push("/");
  }

  if(user !== null) {
  return (
    <div className='relative flex items-center text-white gap-x-2 font-bold cursor-pointer'

    >
      <span className='grid relative w-[30px] h-[30px]'>
        <Image
        alt={user?.fullName}
        src={user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 33vw"
        className='rounded-full'
        priority
        />
      </span>
      <div className='text-[13px]'>
        <p>Xin chào</p>
        <p>{user?.fullName}</p>
      </div>
      
      {/* Dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer absolute object-fill w-full h-full" />
        <DropdownMenuContent className="w-72 mr-32 rounded-none text-[18px]">
          {/* Xin chào */}
          <DropdownMenuItem 
          className='p-2 h-10 font-bold cursor-pointer group hover:text-red-500' 
          >
            <span><Hand size={30} strokeWidth={3} className='text-black group-hover:text-red-500' /></span>
            <p className='text-back group-hover:text-red-500'>Xin chào, {user?.fullName}</p>
          </DropdownMenuItem>
          <hr className='border-1 border-gray-200' />
          {/* Đơn hàng của tôi */}
          <DropdownMenuItem 
          onClick={() => router.push('/account/orders')}
          className='p-2 h-10 font-bold cursor-pointer group hover:text-red-500'
          >
            <div className="flex relative text-black group-hover:text-red-500">
              <i className="bi bi-clipboard2"></i>
              <i className="bi bi-clock-fill bottom-0 end-0 rounded-circle absolute" 
              style={{fontSize: '0.5rem'}}>
              </i>
            </div>
            <p className='text-back group-hover:text-red-500'>Đơn hàng của tôi</p>
          </DropdownMenuItem>
          {/* Thông tin cá nhân */}
          <DropdownMenuItem 
          onClick={() => router.push('/account')}
          className='p-2 h-10 font-bold cursor-pointer group hover:text-red-500'
          >
            <span><UserRoundPen size={30} strokeWidth={3} className='text-black group-hover:text-red-500' /></span>
            <p className='text-back group-hover:text-red-500'>Cập nhật thông tin cá nhân</p>
          </DropdownMenuItem>
          {/* Đăng xuất */}
          <LogoutConfirmDialog onLogout={handleLogout}>
            <DropdownMenuItem
            onSelect={(e) => e.preventDefault()} // ngăn Dropdown đóng
            className='p-2 h-10 font-bold cursor-pointer group hover:text-red-500'
            >
              <span><LogOut size={30} strokeWidth={3} className='text-black group-hover:text-red-500' /></span>
              <p className='text-back group-hover:text-red-500'>Đăng xuất</p>
            </DropdownMenuItem>
          </LogoutConfirmDialog>
        </DropdownMenuContent>
      </DropdownMenu>    
    </div>
    )
  } else return (
    <IconHeader 
    icon = {<i className="bi bi-person"></i>}
    title = {<>Đăng<br />nhập</>}
    url = '/login'
    /> // Nếu không có user
  ) 
}
