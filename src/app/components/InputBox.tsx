"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Image as ImageIcon, ArrowUp } from "lucide-react";

export default function InputBox({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_HEIGHT = 126;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, MAX_HEIGHT) + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() === "") return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="border border-gray-300 rounded-2xl p-3 bg-white">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="詢問任何穿搭建議"
        className="w-full resize-none p-2 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none overflow-y-auto"
        style={{ maxHeight: MAX_HEIGHT }}
      />
      <div className="flex items-center justify-between">
        <div className="flex space-x-2 ml-2">
          <button className="text-gray-400 hover:text-black border border-gray-400 rounded-full p-1">
            <Camera size={20} />
          </button>
          <button className="text-gray-400 hover:text-black border border-gray-400 rounded-full p-1">
            <ImageIcon size={20} />
          </button>
        </div>
        <button
          type="button"
          className="bg-black text-white rounded-full p-2 hover:opacity-90"
          onClick={handleSend}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
