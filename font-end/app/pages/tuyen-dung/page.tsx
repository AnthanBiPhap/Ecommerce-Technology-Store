import React from 'react';

export default function RecruitmentPage() {
  return (
    <div className="bg-gray-200 text-black p-10 rounded-2xl max-w-4xl mx-auto my-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-red-500 mb-8">Tuyển dụng</h1>
      <p className="text-lg leading-8 mb-6">
        GearVN luôn tìm kiếm những tài năng đam mê công nghệ và game để cùng phát triển và tạo nên những giá trị tích cực cho cộng đồng game thủ Việt Nam.
      </p>
      <ul className="list-disc pl-6">
        <li className="mb-4">Môi trường làm việc trẻ trung, năng động.</li>
        <li className="mb-4">Cơ hội học hỏi và phát triển kỹ năng cá nhân.</li>
        <li className="mb-4">Tham gia vào cộng đồng yêu công nghệ và game lớn mạnh.</li>
        <li className="mb-4">Chế độ đãi ngộ hấp dẫn và lộ trình phát triển rõ ràng.</li>
      </ul>
      <p className="text-lg leading-8 mb-6">
        Hãy gia nhập cùng chúng tôi để tạo nên những trải nghiệm tuyệt vời cho cộng đồng game thủ Việt!
      </p>
    </div>
  );
}

