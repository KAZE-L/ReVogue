// app/survey/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function SurveyPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">ReVogue</h1>
          <p className="text-sm text-gray-700 mb-6">
            歡迎來到你的虛擬穿搭顧問！
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            我們將透過六位專屬顧問，<br />
            根據你的行程、風格與特色，<br />
            為你打造最合適的每日穿搭建議。<br />
            只需要幾個步驟，<br />
            就能展開專屬於你的時尚對話。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStarted(true)}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              馬上開始
            </button>
            <button
              className="w-full border border-black text-black py-2 rounded hover:bg-gray-100 transition"
              onClick={() => router.push('/chatbot')}
            >
              先逛逛
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 接下來顯示第一題（你可以換成題目邏輯）
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">第一題：你喜歡晴天還是雨天？</h2>
      <div className="mt-4 space-y-2">
        <button className="block w-full p-2 rounded bg-gray-100 hover:bg-gray-200">
          晴天
        </button>
        <button className="block w-full p-2 rounded bg-gray-100 hover:bg-gray-200">
          雨天
        </button>
      </div>
    </div>
  );
}
