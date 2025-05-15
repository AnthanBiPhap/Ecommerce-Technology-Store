import React from 'react'

export default function ContactPage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Liên hệ</h1>
      <p className="text-lg leading-8 mb-6">
        Nếu bạn có bất kỳ câu hỏi, góp ý hoặc muốn kết nối cùng GearVN, hãy liên hệ với chúng tôi qua các kênh dưới đây:
      </p>
      <ul className="list-disc pl-6">
        <li className="mb-4">📧 Email: support@gearvn.com</li>
        <li className="mb-4">📞 Hotline: 1900.5301</li>
        <li className="mb-4">📍 Địa chỉ: 123 Đường Công Nghệ, Quận 10, TP.HCM</li>
      </ul>
      <p className="text-lg leading-8 mb-6">
        GearVN rất hân hạnh được hỗ trợ bạn!
      </p>
    </div>
  );
}
