"use client";

import { useState } from 'react'

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const cartItems = [
    { id: 1, name: "iPhone 15 Pro", price: 32000000, quantity: 1 },
    { id: 2, name: "AirPods Pro 2", price: 5200000, quantity: 2 },
  ];

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đặt hàng thành công! 🎉");
    console.log("Thông tin:", form);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-600">Thanh toán</h1>

      {/* Sản phẩm trong giỏ */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <span>{item.name} x{item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()}đ</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Tổng:</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Form thanh toán */}
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded-xl shadow space-y-4 bg-gray-50"
      >
        <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>

        <input
          name="name"
          type="text"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="phone"
          type="tel"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="address"
          type="text"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}
