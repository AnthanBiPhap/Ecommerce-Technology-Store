"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { env } from "@/libs/env.helper";
import axios from "axios";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const schema = yup
  .object({
    userName: yup.string().required("User Name is required"),
    fullName: yup.string().required("Full Name is required"),
    email: yup
      .string()
      .max(100)
      .required("Email is required")
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email address is invalid"
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    avatarUrl: yup.string().nullable(),
  })
  .required();

interface IUserForm {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export default function RegisterButton() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //khai báo form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUserForm>({
    resolver: yupResolver(schema) as unknown as Resolver<IUserForm>,
    mode: "onChange",
  });
  //--------------------- BEGIN UPLOAD AVATAURL --------------------//
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image
    await uploadImage(file);
  };

  // Upload image to server
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      // Important: The backend expects the file with the field name that matches multer configuration
      // In your backend code, it's likely expecting "file" as the field name
      formData.append("file", file);

      console.log("Uploading file:", file.name, file.type, file.size);

      // Upload to your server or a cloud storage service
      const response = await axios.post(
        `${env.API_URL}/uploads/single/RegisterUser`,
        formData,
        {
          headers: {
              "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response);

      if (response.status === 200) {
        // Set the returned URL to the form
        const avatarUrl = response.data.data?.url;
        if (avatarUrl) {
          setValue("avatarUrl", avatarUrl, { shouldValidate: true });
          console.log("avatarUrl set to:", avatarUrl);
        } else {
          console.error("avatarUrl is missing in response:", response.data);
        }
      } else {
        alert("Tải ảnh lên thất bại!");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      console.error("Error details:", error.response?.data);
      alert(
        `Có lỗi xảy ra khi tải ảnh lên: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Clear selected image
  const clearImage = () => {
    setPreviewImage(null);
    setValue("avatarUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  //--------------------- END UPLOAD AVATAURL --------------------//

  const createUser = async (
    values: IUserForm
  ): Promise<IUserForm | undefined> => {
    try {
      // Thực hiện gọi API để thêm địa chỉ
      console.log("Submitting user data:", values);
      const response = await axios.post(`${env.API_URL}/users`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        alert("Bạn đã tạo tài khoản thành công!");
        setOpen(false);
        return response?.data?.data;
      } else {
        alert("Tạo tài khoản thất bại!");
      }
    } catch (error) {
      console.error("create new user failed", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  // Chuyển hướng đến trang đăng ký
                  // Ví dụ: window.location.href = '/register';
                }}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="flex justify-center">
            <DialogTitle className="flex justify-center pb-4 border-b border-gray-300 font-bold text-red-500">
              Đăng ký tài khoản
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(createUser)}
            className="space-y-4 flex flex-col"
          >
            {/* userName */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="userName"
                className="font-bold w-[130px] text-start"
              >
                User Name
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="userName"
                  {...register("userName")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.userName && (
                  <span className="text-red-500 text-[12px]">
                    {errors.userName.message}
                  </span>
                )}
              </div>
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
            {/* email */}
            <div className="flex gap-x-5 items-center">
              <label htmlFor="email" className="font-bold w-[130px] text-start">
                Email
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="email"
                  {...register("email")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.email && (
                  <span className="text-red-500 text-[12px]">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
            {/* password */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="password"
                className="font-bold w-[130px] text-start"
              >
                Password
              </label>
              <div className="flex flex-1 flex-col">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="input border border-gray-700 px-4 py-2"
                />
                {errors.password && (
                  <span className="text-red-500 text-[12px]">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
            {/* avatarUrl */}
            <div className="flex gap-x-5 items-center">
              <label
                htmlFor="avatarUrl"
                className="font-bold w-[130px] text-start pt-2"
              >
                Ảnh đại diện
              </label>
              <div className="flex flex-1 flex-col items-center justify-center">
                {/* Hidden file input */}
                <input
                  type="file"
                  id="avatarFile"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Hidden original input for form validation */}
                <input
                  type="hidden"
                  id="avatarUrl"
                  {...register("avatarUrl")}
                />

                {/* Image preview area */}
                {previewImage ? (
                  <div className="relative w-24 h-24 mb-2">
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      alt="Avatar image"
                      fill
                      className="object-cover rounded-full border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center cursor-pointer mb-2 hover:border-gray-500"
                  >
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      Tải ảnh lên
                    </span>
                  </div>
                )}

                {errors.avatarUrl && (
                  <span className="text-red-500 text-[12px]">
                    {errors.avatarUrl.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button type="submit" className="px-10 py-1 bg-black">
                Đăng ký
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
