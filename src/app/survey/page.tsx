// app/survey/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";


const questions = [
  {
    title: "你的性別",
    description:
      "不同性別在衣物設計上有版型差異，提供性別能讓系統建議更合身、符合日常需求的穿搭組合。",
    type: "choice",
    options: ["男性", "女性", "其他"],
  },
  {
    title: "你的身高",
    description:
      "身高資訊有助於掌握穿搭比例，例如衣服長度、褲款選擇，提升整體視覺平衡感。",
    type: "input",
    placeholder: "輸入身高",
  },
  {
    title: "你的膚色",
    description:
      "膚色是色彩鑑定的關鍵依據，能幫助我們挑選更適合你的主色與配件色，提升整體氣質與和諧感。",
    type: "choice",
    options: ["白色", "膚色", "黑色"],
  },
  {
    title: "你的職業",
    description:
      "根據你的工作性質，我們會建議適合的穿搭語言與風格，展現你的專業與個性。",
    type: "input",
    placeholder: "輸入職業",
  },
  {
    title: "上傳一張你的照片",
    description:
      "上傳一張你平常的全身照或自拍照，我們會自動分析體型與膚色，幫助顧問們提供更準確建議。",
    type: "choice",
    options: ["上傳照片"],
  },
  {
    title: "你的風格偏好",
    description:
      "我們希望打造你「自己也會愛上」的穿搭風格，你可以勾選喜歡的風格參考。",
    type: "choice",
    options: ["極簡","知性通勤","日系","都會休閑","視覺系"],
  },
  {
    title: "你的行程",
    description:
      "若你願意，我們可以讀取你的今日日程（Google Calendar），根據天氣、地點與行程內容進行穿搭建議。",
    type: "choice",
    options: ["同步行事曆活動"],
  },
  {
    title: "你的衣櫃",
    description:
      "如果你已經有一些常穿的衣物，我們可以依據你衣櫃內容來推薦實際可行的穿搭組合。",
    type: "choice",
    options: ["上傳照片"],
  },
];

export default function SurveyPage() {
  const router = useRouter();

  const [started, setStarted] = useState(false);

  const [step, setStep] = useState(0);
  const totalSteps = questions.length;

  const current = questions[step];

  const goPrev = () => {
    if (step === 0) {
      setStarted(false);
    } else {
      setStep(step - 1);
    }
  };

  const goNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setFinished(true); //完成個人化
    }
  };

  const [finished, setFinished] = useState(false);


  if (!started) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-10">ReVogue</h1>
          <p className="text-sm text-black font-normal mb-5">
            歡迎來到你的虛擬穿搭顧問！
          </p>
          <Image src="/star.svg" alt="star" width={20} height={20} className="mx-auto mb-5" />
          <p className="text-sm text-black font-semibold leading-loose mb-5 px-6 ">
            我們將透過六位專屬顧問，<br />
            根據你的行程、風格與特色，<br />
            為你打造最合適的每日穿搭建議。<br />
            只需要幾個步驟，<br />
            就能展開專屬於你的時尚對話。
          </p>
          <Image src="/star.svg" alt="star" width={20} height={20} className="mx-auto mb-6" />
          <div className="space-y-5">
            <button
              onClick={() => setStarted(true)}
              className="w-full border border-black bg-[#3E3E3E] text-sm text-white font-bold py-2 rounded-xl shadow-[0_0_0_2px_white,0_0_0_4px_black] hover:bg-gray-600 transition"
            >
              馬上開始
            </button>
            <button
              className="w-full border border-[#3E3E3E] text-[#3E3E3E] font-bold py-2 rounded-xl hover:bg-gray-100 transition"
              onClick={() => router.push('/chatbot')}
            >
              先逛逛
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-2xl font-bold mb-14">ReVogue</h1>
        <h2 className="text-md font-bold">準備完成！</h2>

        <div className="text-sm font-semibold text-gray-700 space-y-2 px-6">
          <Image src="/star.svg" alt="star" width={20} height={20} className="mx-auto pt-2 mb-8" />

          <p>你的六位穿搭顧問已經準備就緒！</p>
          <p>點擊開始，開啟你的專屬穿搭提案！</p>

          <Image src="/star.svg" alt="star" width={20} height={20} className="mx-auto pt-6 pb-4" />
        </div>

        <div className="space-y-5 ">
          <button
            onClick={() => router.push("/chatbot")}
            className="w-full border border-black bg-[#3E3E3E] text-sm text-white font-bold py-2 rounded-xl shadow-[0_0_0_2px_white,0_0_0_4px_black] hover:bg-gray-600 transition"
          >
            開始對話
          </button>
          <button
            onClick={() => {
              setStep(0);
              setStarted(false);
              setFinished(false);
            }}
            className="w-full border border-[#3E3E3E] text-[#3E3E3E] font-bold py-2 rounded-xl hover:bg-gray-100 transition"
          >
            重新個人化
          </button>
        </div>
      </div>
    </main>
  );
}


  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="max-w-md w-full text-left">
        {/* 題數與進度 */}
        <div className="flex justify-left items-baseline mb-4">
          <span className="text-5xl font-bold">
            {String(step + 1).padStart(2, "0")}
          </span>
          <span className="ml-2 text-[#C5C5C5] text-2xl font-bold">
            /{String(totalSteps).padStart(2, "0")}
          </span>
        </div>

        {/* 藍色底線 */}
        <div className="flex justify-left w-12 h-2 bg-[#0891B2] mb-7" />

        {/* 問題標題與描述 */}
        <h2 className="text-lg font-bold mb-2">{current.title}</h2>
        <p className="text-sm font-semibold text-gray-600 mb-14 leading-relaxed">
          {current.description}
        </p>

        {/* 題型渲染 */}
        {current.type === "choice" && (
          <div className="space-y-6 mb-24 px-14 font-bold text-[#3E3E3E]">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                className="w-full border border-[#3E3E3E] py-2 rounded-xl hover:bg-gray-100 transition"
                onClick={goNext}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.type === "input" && (
          <div className="mb-8">
            <input
              type="text"
              placeholder={current.placeholder}
              className="w-full border-b border-gray-300 text-center py-2 focus:outline-none focus:border-black mb-8"
            />
          </div>
        )}

        {/* 底部按鈕區 */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-10">
          <button onClick={goPrev} className="flex items-center space-x-1">
            <ChevronLeft className="w-4 h-4" />
            <span>上一題</span>
          </button>
          <button onClick={goNext} className="flex items-center space-x-1">
            <span>不提供{current.title.replace("你的", "")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-10 px-14">
        <button className="w-full border border-gray-400 font-bold py-2 rounded-xl hover:bg-gray-100 transition"
         onClick={() => router.push('/chatbot')}
        >
          跳過個人化
        </button>
        </div>
      </div>
    </main>
  );
}
