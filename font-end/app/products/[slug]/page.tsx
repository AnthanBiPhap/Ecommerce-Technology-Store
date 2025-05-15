
import { Home, Star } from "lucide-react";
import Link from "next/link";
import ProductGallery from "../../../components/SwiperClientComponent";
import ProductCard from "@/components/ProductCard";
import BuyButton from "@/app/ui/buton/BuyButton";
import CollapsibleContentBlock from "@/components/CollapsibleContentBlock";
import SimpleProductSlider from "@/components/SimpleProductSlider";

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
  attributes: (string | { name: string; value: string; time?: string })[];
  rating: number;
  brand: IBrand;
  contentBlock: Array<{
    type: "text" | "image";
    content?: string;
    src?: string;
    alt?: string;
    _id: string;
  }>;
  isActive: boolean;
  bestSale: boolean;
  flashSale: boolean;
  reviewCount: number;
  tags: string[];
}

interface ICategory {
  _id: string;
  category_name: string;
  slug: string;
}

interface IBrand {
  _id: string;
  brand_name: string;
  slug: string;
}

interface IUser {
  _id: string;
  fullName: string;
  avatarUrl: string;
}

interface IReview {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerified: boolean;
  product: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Fetch product
  const {slug} = await params;

  console.log('slug===>', slug);
  const res = await fetch(
    `http://localhost:8889/api/v1/products/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error('fetching data is failed', res);
    return <div className="p-6">Không thể tải dữ liệu sản phẩm.</div>;
  }

  const data = await res.json();
  const product: Product = data.data;

  // Fetch actual category name
  let categoryName = "Danh mục";
  let categorySlug = "danh-muc";
  console.log("category===>", product.category);
  try {
    const categoryRes = await fetch(
      `http://localhost:8889/api/v1/categories/${product.category}`,
      { cache: "no-store" }
    );
    if (categoryRes.ok) {
      const categoryData = await categoryRes.json();
      categoryName = categoryData.data?.category_name || categoryName;
      categorySlug = categoryData.data?.slug || categorySlug;
    }
  } catch (error) {
    console.error("Lỗi khi lấy category:", error);
  }

  // Fetch similar products
  let similarProducts: Product[] = [];
  try {
    const similarRes = await fetch(
      `http://localhost:8889/api/v1/products?category_slug=${categorySlug}&limit=5`,
      { cache: "no-store" }
    );
    if (similarRes.ok) {
      const similarData = await similarRes.json();
      similarProducts = similarData.data.products.filter(
        (p: Product) => p._id !== product._id
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm tương tự:", error);
  }

  let reviews: IReview[] = [];
  try {
    const reviewsRes = await fetch(
      `http://localhost:8889/api/v1/reviews?productId=${product._id}`,
      { cache: "no-store" }
    );
    if (reviewsRes.ok) {
      const reviewsData = await reviewsRes.json();
      reviews = reviewsData.data?.reviews || [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
  }

  const originalPrice = product.price || product.salePrice * 1.25;
  const discountPercent = Math.round(
    100 - (product.salePrice / originalPrice) * 100
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-gray-600 mb-8 text-sm">
        <Home className="text-blue-500" />
        <Link href="/" className="hover:underline text-blue-600">
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          href={`/collections/${categoryName}`}
          className="hover:underline text-blue-600"
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span className="font-medium capitalize">{product.product_name}</span>
      </div>

      <div className="max-w-5xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="flex justify-center mb-6 md:mb-0">
          <ProductGallery
            images={product.images}
            productName={product.product_name}
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {product.product_name}
          </h1>

          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <Star size={18} className="text-yellow-500" />
            <span>{product.rating.toFixed(1)}</span>
            <Link href="#reviews">
              <p className="text-blue-500 hover:underline cursor-pointer ">
                Xem đánh giá
              </p>
            </Link>
          </div>

          <div className="mb-6 flex items-center space-x-4 text-lg">
            <span className="line-through text-gray-400">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-red-600 font-bold text-xl">
              {formatPrice(product.salePrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>

          <BuyButton 
          productId={product._id}
          price={product.price}
          salePrice={product.salePrice}
          />

          <div className="bg-gray-50 rounded-md text-sm p-4 mb-6 mt-6">
            <h3 className="font-semibold mb-2 text-gray-800">Mô tả sản phẩm</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-600 bg-gray-200 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Sản phẩm tương tự</h2>
          <SimpleProductSlider
            products={similarProducts}
          />
        </div>
      )}

      {/* Product Features */}
      <div className="bg-gray-100 rounded-md text-sm p-4 mb-6 mt-8 w-[600px]">
        <h3 className="font-semibold mb-2 text-2xl">Thông số kỹ thuật</h3>
        <ul className="space-y-2 text-gray-700">
          {product.attributes.map((attr, index) => (
            <li key={index}>
              🔹{" "}
              {typeof attr === "string"
                ? attr
                : `${attr.name}: ${attr.value}${
                    attr.time ? ` (${attr.time})` : ""
                  }`}
            </li>
          ))}
        </ul>
        <CollapsibleContentBlock blocks={product.contentBlock}/>
      </div>

      {/* Product Reviews */}
      <div className="mt-12" id="reviews">
        <h2 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  <div className="text-yellow-500 flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < review.rating
                            ? "fill-yellow-500"
                            : "fill-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={
                      review.user.avatarUrl || "https://via.placeholder.com/40"
                    }
                    alt={review.user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {review.user.fullName}
                    </h2>
                  </div>
                </div>

                {/* Review Title */}
                <h4 className="font-semibold text-md text-gray-900 mb-2">
                  {review.title}
                </h4>

                {/* Review Comment */}
                <p className="text-gray-700 text-sm mb-4">{review.comment}</p>

                {/* Review Images */}
                {review.images?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`review-img-${idx}`}
                        className="w-24 h-24 object-cover rounded-md border border-gray-300"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}