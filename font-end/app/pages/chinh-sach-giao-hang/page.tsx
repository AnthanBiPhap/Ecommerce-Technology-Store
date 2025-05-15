import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Chính sách giao hàng</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN cam kết mang đến cho khách hàng trải nghiệm mua sắm tốt nhất với chính sách giao hàng nhanh chóng, an toàn và tiện lợi.
      </p>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">1. Phạm vi giao hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Giao hàng toàn quốc, bao gồm tất cả các tỉnh, thành phố tại Việt Nam.</li>
        <li className="mb-2">Hỗ trợ giao hàng đến các khu vực vùng sâu, vùng xa với phí vận chuyển phù hợp.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">2. Thời gian giao hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Khu vực nội thành: 1-2 ngày làm việc.</li>
        <li className="mb-2">Khu vực ngoại thành và tỉnh lân cận: 2-4 ngày làm việc.</li>
        <li className="mb-2">Khu vực miền núi, hải đảo: 4-7 ngày làm việc.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">3. Phí vận chuyển</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Phí vận chuyển được tính dựa trên trọng lượng, kích thước sản phẩm và khoảng cách giao hàng.</li>
        <li className="mb-2">Miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng trở lên (tùy khu vực).</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">4. Chính sách kiểm tra hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Khách hàng có quyền kiểm tra hàng trước khi thanh toán.</li>
        <li className="mb-2">Trường hợp sản phẩm bị lỗi, hư hỏng do vận chuyển, GearVN cam kết đổi trả miễn phí.</li>
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
