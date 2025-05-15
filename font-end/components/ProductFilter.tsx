"use client";

import React, { useState } from "react";

interface ProductFilterProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  onFilter: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  searchKeyword,
  setSearchKeyword,
  sortOrder,
  setSortOrder,
  onFilter,
}) => {
  return (
    <div className="mb-6 p-4 bg-white shadow rounded-xl flex flex-col md:flex-row md:items-center gap-4">
      {/* Tìm kiếm theo tên sản phẩm */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="border p-2 rounded w-full md:w-1/3"
      />

      {/* Sắp xếp */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="">Sắp xếp</option>
        <option value="price:asc">Giá tăng dần</option>
        <option value="price:desc">Giá giảm dần</option>
        <option value="createdAt:desc">Mới nhất</option>
        <option value="createdAt:asc">Cũ nhất</option>
      </select>

      {/* Nút lọc */}
      <button
        onClick={onFilter}
        className="bg-blue-600 text-white p-2 rounded w-full md:w-auto"
      >
        Lọc sản phẩm
      </button>
    </div>
  );
};

export default ProductFilter;
