"use client"
import React, { useState } from 'react'

export default function CommentButton() {
  const [active, setActive] = useState(false);
  const [comment, setComment] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setComment('');
      alert("Bình luận đã được gửi!");
    } catch (err) {
      console.error("Gửi bình luận thất bại:", err);
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="flex items-center gap-x-1 px-3 py-1.5 rounded-md text-blue-500 hover:text-blue-600 transition duration-150"
      >
        <i className="bi bi-chat-left"></i>
        <span>Comment</span>
      </button>

      {active && (
        <form onSubmit={handleSubmitComment} className="mt-3">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập bình luận của bạn..."
            value={comment}
            rows={5}
            cols={200}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-150"
          >
            Gửi bình luận
          </button>
        </form>
      )}
    </div>
  );
}