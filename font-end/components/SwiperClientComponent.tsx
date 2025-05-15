"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  // Number of thumbnails to show at once
  const visibleThumbnails = 5;

  // Handle when no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Không có hình ảnh</p>
      </div>
    );
  }

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + visibleThumbnails < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="product-gallery w-full">
      {/* Main image */}
      <div className="w-full h-[400px] bg-white flex items-center justify-center rounded-lg shadow mb-4 overflow-hidden">
        <img
          src={images[activeIndex] || "/placeholder.svg"}
          alt={`${productName} - Hình ${activeIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnails navigation */}
      <div className="relative flex items-center">
        {/* Left navigation button */}
        <button
          onClick={handlePrevious}
          disabled={startIndex === 0}
          className={`absolute left-0 z-10 rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-md ${
            startIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Thumbnails container */}
        <div className="flex-1 overflow-hidden mx-10">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${startIndex * (80 + 8)}px)` }} // 80px width + 8px gap
          >
            {images.map((image, index) => (
              <div
                key={`thumb-${index}`}
                className={`w-20 h-20 flex-shrink-0 cursor-pointer mr-2 ${
                  activeIndex === index
                    ? "border-2 border-red-500"
                    : "border border-gray-200"
                } rounded-md overflow-hidden`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right navigation button */}
        <button
          onClick={handleNext}
          disabled={startIndex + visibleThumbnails >= images.length}
          className={`absolute right-0 z-10 rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-md ${
            startIndex + visibleThumbnails >= images.length
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-100"
          }`}
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
