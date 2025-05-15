import React from 'react';

export default function PurchaseGuidePage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Hướng dẫn mua hàng</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN cung cấp các bước hướng dẫn chi tiết để giúp khách hàng có trải nghiệm mua sắm dễ dàng và thuận tiện nhất.
      </p>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">1. Tìm kiếm sản phẩm</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Sử dụng thanh tìm kiếm hoặc duyệt qua các danh mục sản phẩm trên trang chủ.</li>
        <li className="mb-2">Sử dụng bộ lọc để tìm kiếm nhanh các sản phẩm theo nhu cầu.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">2. Thêm sản phẩm vào giỏ hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Chọn sản phẩm mong muốn và nhấn nút "Thêm vào giỏ hàng".</li>
        <li className="mb-2">Kiểm tra giỏ hàng để đảm bảo đúng sản phẩm và số lượng.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">3. Tiến hành thanh toán</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Nhấn nút "Thanh toán" để chuyển đến trang thanh toán.</li>
        <li className="mb-2">Nhập đầy đủ thông tin giao hàng và chọn phương thức thanh toán phù hợp.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">4. Xác nhận và nhận hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Kiểm tra lại thông tin đơn hàng và nhấn nút "Xác nhận đặt hàng".</li>
        <li className="mb-2">Nhận thông báo xác nhận đơn hàng qua email và theo dõi trạng thái giao hàng.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">5. Liên hệ hỗ trợ</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">📧 Email: support@gearvn.com</li>
        <li className="mb-2">📞 Hotline: 1900.5301</li>
        <li className="mb-2">📍 Địa chỉ: 123 Đường Công Nghệ, Quận 10, TP.HCM</li>
      </ul>
    </div>
  );
}