import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Chính sách bảo mật</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN cam kết bảo mật thông tin cá nhân của khách hàng, đảm bảo quyền riêng tư và bảo vệ dữ liệu trong quá trình sử dụng dịch vụ của chúng tôi.
      </p>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">1. Thu thập thông tin cá nhân</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">GearVN thu thập thông tin cá nhân của khách hàng khi đăng ký tài khoản, đặt hàng hoặc tham gia các chương trình khuyến mãi.</li>
        <li className="mb-2">Các thông tin có thể bao gồm: họ tên, địa chỉ, số điện thoại, email và thông tin thanh toán.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">2. Sử dụng thông tin cá nhân</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Thông tin cá nhân được sử dụng để xử lý đơn hàng, cung cấp dịch vụ và hỗ trợ khách hàng.</li>
        <li className="mb-2">Gửi thông báo về tình trạng đơn hàng, chương trình khuyến mãi và cập nhật sản phẩm mới.</li>
        <li className="mb-2">Cải thiện chất lượng dịch vụ và trải nghiệm mua sắm của khách hàng.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">3. Bảo mật thông tin</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">GearVN áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc rò rỉ.</li>
        <li className="mb-2">Chỉ chia sẻ thông tin cá nhân với các đối tác đáng tin cậy khi cần thiết để cung cấp dịch vụ cho khách hàng.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-red-400 mb-4">4. Quyền của khách hàng</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">Khách hàng có quyền yêu cầu chỉnh sửa, cập nhật hoặc xóa thông tin cá nhân bất kỳ lúc nào.</li>
        <li className="mb-2">GearVN cam kết tôn trọng và thực hiện các quyền riêng tư của khách hàng theo quy định pháp luật.</li>
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
