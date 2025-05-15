// components/InstallmentGuidePage.tsx
import React from 'react';

export default function InstallmentGuidePage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Hướng dẫn trả góp</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN cung cấp phương thức trả góp dễ dàng và tiện lợi cho khách hàng. Dưới đây là các bước và thông tin chi tiết về chương trình trả góp của chúng tôi.
      </p>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">1. Điều kiện để tham gia trả góp</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Khách hàng phải có CMND/CCCD hoặc hộ chiếu còn hiệu lực.</li>
        <li className="mb-2">Khách hàng cần có nguồn thu nhập ổn định và chứng minh được khả năng thanh toán hàng tháng.</li>
        <li className="mb-2">Chỉ áp dụng cho các sản phẩm có giá trị từ 3 triệu đồng trở lên.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">2. Các hình thức trả góp</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Trả góp 3 tháng, 6 tháng, 9 tháng, 12 tháng hoặc 24 tháng.</li>
        <li className="mb-2">Lãi suất thấp, chỉ từ 0% tùy theo chương trình khuyến mãi và đối tác tài chính.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">3. Quy trình đăng ký trả góp</h2>
      <ol className="list-decimal pl-6 mb-6">
        <li className="mb-2">Chọn sản phẩm bạn muốn mua và chọn phương thức thanh toán trả góp tại trang thanh toán.</li>
        <li className="mb-2">Điền thông tin cá nhân và các giấy tờ cần thiết để xác nhận khả năng tài chính (CMND/CCCD, hóa đơn điện/nước, sao kê lương, v.v.).</li>
        <li className="mb-2">Chọn kỳ hạn trả góp và xác nhận các điều khoản và lãi suất.</li>
        <li className="mb-2">Chờ phê duyệt từ đối tác tài chính và nhận kết quả.</li>
        <li className="mb-2">Ký hợp đồng và thanh toán theo lịch đã đăng ký.</li>
      </ol>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">4. Các phương thức trả góp</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Trả góp qua các đối tác tài chính: Home Credit, Fe Credit, HDbank, VPBank...</li>
        <li className="mb-2">Hỗ trợ thanh toán qua thẻ tín dụng hoặc tài khoản ngân hàng.</li>
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

