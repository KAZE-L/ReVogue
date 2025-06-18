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
    <div className="inputbox-container">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="詢問任何穿搭建議"
        className="inputbox-textarea"
      />
      <div className="inputbox-actions">
        <div className="inputbox-btn-group">
          <button className="inputbox-icon-btn">
            <Camera size={20} />
          </button>
          <button className="inputbox-icon-btn">
            <ImageIcon size={20} />
          </button>
        </div>
        <button
          type="button"
          className="inputbox-send-btn"
          onClick={handleSend}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
