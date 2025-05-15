import React from 'react';

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Chính sách bảo hành</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN cam kết mang đến cho khách hàng những sản phẩm chất lượng cùng chính sách bảo hành minh bạch và rõ ràng nhằm bảo vệ quyền lợi người tiêu dùng.
      </p>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">1. Thời gian bảo hành</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Sản phẩm được bảo hành từ 12 đến 36 tháng tùy theo từng loại.</li>
        <li className="mb-2">Thời gian bảo hành được tính từ ngày mua hàng ghi trên hóa đơn.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">2. Điều kiện bảo hành</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Sản phẩm còn trong thời gian bảo hành và có phiếu bảo hành hợp lệ.</li>
        <li className="mb-2">Sản phẩm không bị hư hỏng do tác động từ bên ngoài như va đập, cháy nổ, nước vào.</li>
        <li className="mb-2">Sản phẩm không bị can thiệp bởi bên thứ ba hoặc tự ý sửa chữa.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">3. Quy trình bảo hành</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Khách hàng mang sản phẩm đến trung tâm bảo hành của GearVN hoặc gửi qua đường bưu điện.</li>
        <li className="mb-2">Sản phẩm sẽ được kiểm tra và xác nhận lỗi trước khi bảo hành.</li>
        <li className="mb-2">Thời gian xử lý bảo hành từ 3-7 ngày làm việc.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">4. Liên hệ hỗ trợ</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">📧 Email: support@gearvn.com</li>
        <li className="mb-2">📞 Hotline: 1900.5301</li>
        <li className="mb-2">📍 Địa chỉ: 123 Đường Công Nghệ, Quận 10, TP.HCM</li>
      </ul>
    </div>
  );
}
