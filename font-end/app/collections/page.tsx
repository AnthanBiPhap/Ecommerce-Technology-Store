"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Filter, Home } from "lucide-react";

interface Product {
  _id: string;
  product_name: string;
  description: string;
  slug: string;
  price: number;
  salePrice: number;
  stock: number;
  images: string[];
  category: ICategory;
  attributes: string[];
  rating: number;
  brand: Brand;
  reviewCount: number;
  tags: string[];
}

interface ICategory {
  _id: string;
  category_name: string;
}

interface Brand {
  _id: string;
  brand_name: string;
}

interface ApiResponse {
  data: {
    products: Product[];
    pagination: {
      totalRecord: number;
    };
  };
}

export default async function ProductPageByCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [products, setProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noProducts, setNoProducts] = useState<boolean>(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    setNoProducts(false);

    const queryParams = new URLSearchParams({
      category_name: slug,
      page: currentPage.toString(),
      limit: "12",
      ...(minPrice && { price_gte: minPrice }),
      ...(maxPrice && { price_lte: maxPrice }),
      ...(selectedBrand && { product_name: selectedBrand }),
      ...(selectedRating && { rating: selectedRating }),
      ...(sortOrder && {
        sort_by: sortOrder === "newest" ? "createdAt" : "price",
        sort_type:
          sortOrder === "asc" ? "asc" : sortOrder === "desc" ? "desc" : "desc",
      }),
    });

    const query = `http://localhost:8889/api/v1/products?${queryParams.toString()}`;

    try {
      const res = await fetch(query);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data: ApiResponse = await res.json();
      setProducts(data.data.products);
      setTotalPages(Math.ceil(data.data.pagination.totalRecord / 12));
      if (data.data.products.length === 0) setNoProducts(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProducts();
    }
  }, [
    slug,
    minPrice,
    maxPrice,
    selectedBrand,
    selectedRating,
    sortOrder,
    currentPage,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setMaxPrice(value);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-gray-600 mb-8 text-[15px]">
        <Home className="text-blue-500" />
        <Link href="/" className="hover:underline text-blue-600">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-medium capitalize">
          {products.length > 0 ? products[0].category.category_name : slug}
        </span>
      </div>

      {/* Filter */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <Filter className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Bộ lọc</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Filters for Brand, Rating, Sorting, and Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thương hiệu
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">Tất cả</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} sao
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Mặc định</option>
              <option value="asc">Giá tăng</option>
              <option value="desc">Giá giảm</option>
              <option value="newest">Mới nhất</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>
          <div className="sm:col-span-3 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá từ
              </label>
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Ví dụ: 1000000"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến
              </label>
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Ví dụ: 5000000"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading ? (
          <div className="w-full flex justify-center items-center py-8">
            Loading...
          </div>
        ) : noProducts ? (
          <div className="w-full flex justify-center items-center py-8">
            <span className="text-lg text-gray-600">
              Không tìm thấy sản phẩm
            </span>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
          disabled={currentPage === 1 || isLoading}
        >
          Trước
        </button>
        <span className="flex items-center justify-center">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
          disabled={currentPage === totalPages || isLoading}
        >
          Sau
        </button>
      </div>
    </div>
  );
};