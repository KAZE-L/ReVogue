"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Image as ImageIcon, ArrowUp } from "lucide-react";

export default function InputBox({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() === "") return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl border border-gray-300 shadow-sm">
      <div className="p-3 flex flex-col">
        {/* 固定高度的容器 */}
        <div className="relative h-[60px] rounded-lg overflow-hidden">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="詢問任何穿搭建議"
            className="w-full h-full py-2 px-4 focus:outline-none resize-none border-none focus:ring-0"
            style={{ 
              minHeight: "80px", // 固定高度
              backgroundColor: "transparent"
            }}
          />
        </div>

        {/* 按鈕行 */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 ml-2">
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <Camera size={20} />
            </button>
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <ImageIcon size={20} />
            </button>
          </div>
          
          <button
            type="button"
            className={`p-2 mr-2 rounded-full transition-colors border ${
              message.trim()
                ? "bg-black text-white border-black hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
            }`}
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}