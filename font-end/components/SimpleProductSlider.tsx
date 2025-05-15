"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductCardProps {
  product: {
    _id: string;
    product_name: string;
    description: string;
    slug: string;
    price: number;
    salePrice: number;
    stock: number;
    images: string[];
    category: {
      _id: string;
      category_name: string;
    };
    attributes: (string | { name: string; value: string })[];
    rating: number;
    brand: {
      _id: string;
      brand_name: string;
    };
    reviewCount: number;
    tags: string[];
  };
  category: string;
}

type Product = ProductCardProps["product"];

interface SimpleProductSliderProps {
  products: Product[]
}

const ITEMS_PER_VIEW = 4;

export default function SimpleProductSlider({
  products,
}: SimpleProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, products.length - ITEMS_PER_VIEW);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <div className="relative w-full">
      {/* Slider content */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / ITEMS_PER_VIEW) * currentIndex}%)`,
            width: `${(100 / ITEMS_PER_VIEW) * products.length}%`,
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="w-full px-2"
              style={{ width: `${100 / products.length}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 disabled:opacity-40"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 disabled:opacity-40"
        disabled={currentIndex === maxIndex}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}