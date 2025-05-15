"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ContentBlock {
  _id: string;
  type: "text" | "image";
  content?: string;
  src?: string;
  alt?: string;
}

export default function CollapsibleContentBlock({
  blocks,
  initiallyExpanded = false,
}: {
  blocks: ContentBlock[];
  initiallyExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <div className="mt-8">
      {/* Content blocks */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {blocks.map((block) => {
          if (block.type === "text") {
            return (
              <div
                key={block._id}
                className="bg-gray-50 rounded-md text-sm p-4 mb-6"
              >
                <div
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                />
              </div>
            );
          } else if (block.type === "image") {
            return (
              <img
                key={block._id}
                src={block.src || "/placeholder.svg"}
                alt={block.alt || "Product image"}
                className="w-full h-auto rounded-md mb-6"
              />
            );
          }
          return null;
        })}
      </div>

      {/* Toggle button */}
      <div className="flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2 px-4"
        >
          <span>{expanded ? "Thu gọn" : "Đọc tiếp bài viết"}</span>
          <ChevronDown
            className={`ml-1 h-4 w-4 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
