"use client"
import React, { useState } from 'react'

export default function LikeButton() {
  const [active, setActive] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className={`flex items-center gap-x-1 px-3 py-1.5 rounded-md ${
          active
            ? "text-yellow-500 hover:text-yellow-600"
            : "text-blue-500 hover:text-blue-600"
        } transition duration-150`}
      >
        <i
          className={
            active
              ? "bi bi-hand-thumbs-up-fill text-yellow-500"
              : "bi bi-hand-thumbs-up"
          }
        ></i>
        <span className={active ? "font-semibold" : ""}>Like</span>
      </button>
    </div>
  );
}