import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      <Image
        src="https://img.freepik.com/premium-vector/page-found-concept-illustration_86161-98.jpg?w=996"
        alt="Not Found"
        width={300}
        height={300}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Trang không tồn tại</h1>
      <p className="text-gray-600 mb-6">
        Có vẻ như bạn đã truy cập vào một trang không tồn tại. Hãy quay lại trang chủ.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
