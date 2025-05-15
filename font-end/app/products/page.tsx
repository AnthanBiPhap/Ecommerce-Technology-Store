"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  slug: string;
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

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Lấy tất cả query từ URL
  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setFilters(params);
  }, [searchParams]);

  // Fetch sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryString = new URLSearchParams(filters || {}).toString();
        console.log('filters====>', filters);
        const res = await fetch(`http://localhost:8889/api/v1/products?${queryString}`);
        const data: ApiResponse = await res.json();
        setProducts(data.data.products);
        setTotalPages(Math.ceil(data.data.pagination.totalRecord / 12));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (Object.keys(filters).length > 0) {
      fetchProducts();
    }
  }, [filters]);
  

  // Cập nhật filter
const updateFilter = (keyOrString: string, value?: string) => {
  let newFilters = { ...filters };
  
  // Kiểm tra xem có phải là chuỗi với nhiều tham số hay không
  if (keyOrString.includes('&') || keyOrString.includes('=')) {
    // Xử lý chuỗi với nhiều tham số
    const params = new URLSearchParams(keyOrString);
    //console.log('params===>', params);
    
    // Chuyển đổi URLSearchParams thành object
    params.forEach((val, key) => {
      if (val) {
        newFilters[key] = val;
      } else {
        delete newFilters[key];
      }
    });
  } else {
    // Xử lý trường hợp đơn giản (key, value)
    if (value) {
      newFilters[keyOrString] = value;
      delete newFilters["sort_type"];
    } else {
      delete newFilters[keyOrString];
    }
  }
  
  setFilters(newFilters);


    // Cập nhật URL
    const queryString = new URLSearchParams(newFilters).toString();
    router.push(`/products?${queryString}`);
  };

  //kiểm tra sort

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
          {filters["category_slug"] || filters["brand_slug"] || "Tất cả"}
        </span>
      </div>

      {/* Bộ lọc */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <Filter className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Bộ lọc</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thương hiệu
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={filters["brand_slug"] || ""}
              onChange={(e) => updateFilter("brand_slug", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="asus">Asus</option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="acer">Acer</option>
              <option value="msi">MSI</option>
              <option value="lenovo">LENOVO</option>
              <option value="hp">HP</option>
              <option value="lg">LG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={filters["category_slug"] || ""}
              onChange={(e) => updateFilter("category_slug", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="laptop">Laptop</option>
              <option value="smartphone">Smartphone</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={filters["rating_gte"] || ""}
              onChange={(e) => updateFilter("rating_gte", e.target.value)}
            >
              <option value="">Tất cả</option>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {"⭐".repeat(star)} trở lên
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
              value={filters["sort_type"] ? `${filters["sort_by"]}|${filters["sort_type"]}` : filters["sort_by"]}
              onChange={(e) => {
                const [sort_by, sort_type] = e.target.value.split("|");
                console.log('sort_by, sort_type===>', sort_by, sort_type);
                if(sort_type === undefined) {
                  updateFilter("sort_by", e.target.value);
                } else {
                  updateFilter(`sort_by=${e.target.value.split("|")[0]}&sort_type=${e.target.value.split("|")[1]}`);
                };
              }}
            >
              <option value="">Mạc định</option>
              <option value="salePrice|asc">Giá tăng</option>
              <option value="salePrice|desc">Giá giảm</option>
              <option value="createdAt">Mới nhất</option>
              <option value="bestSale">Bán chạy</option>
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
                value={filters["price_gte"] || ""}
                onChange={(e) => updateFilter("price_gte", e.target.value)}
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
                value={filters["price_lte"] || ""}
                onChange={(e) => updateFilter("price_lte", e.target.value)}
                placeholder="Ví dụ: 5000000"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading ? (
          <div className="w-full flex justify-center items-center py-8">
            Loading...
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Phân trang */}
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
}
