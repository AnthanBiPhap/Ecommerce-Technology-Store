// components/PaymentGuidePage.tsx
import React from 'react';

export default function PaymentGuidePage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Hướng dẫn thanh toán</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN cung cấp nhiều phương thức thanh toán tiện lợi và an toàn để khách hàng có thể lựa chọn theo nhu cầu của mình.
      </p>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">1. Thanh toán khi nhận hàng (COD)</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Khách hàng thanh toán trực tiếp cho nhân viên giao hàng sau khi nhận và kiểm tra sản phẩm.</li>
        <li className="mb-2">Phương thức này áp dụng cho tất cả các tỉnh thành trên toàn quốc.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">2. Thanh toán chuyển khoản ngân hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Chuyển khoản qua số tài khoản của GearVN được cung cấp trong quá trình thanh toán.</li>
        <li className="mb-2">Vui lòng ghi rõ mã đơn hàng khi chuyển khoản để thuận tiện cho việc xác nhận.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">3. Thanh toán bằng thẻ tín dụng/ghi nợ</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Chấp nhận thanh toán bằng thẻ Visa, MasterCard, JCB, và các loại thẻ ngân hàng nội địa.</li>
        <li className="mb-2">Thông tin thẻ của khách hàng sẽ được bảo mật tuyệt đối.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">4. Thanh toán qua ví điện tử</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Hỗ trợ thanh toán qua các ví điện tử phổ biến như Momo, ZaloPay, VNPay.</li>
        <li className="mb-2">Nhanh chóng, tiện lợi và bảo mật cao.</li>
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

