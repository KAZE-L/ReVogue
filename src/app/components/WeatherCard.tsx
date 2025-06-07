// components/WeatherCard.tsx

import { CloudHail } from "lucide-react";

export default function WeatherCard() {
  return (
    <div className="bg-blue-300 text-white p-4 rounded-xl flex flex-col justify-between min-h-[150px]">
      {/* 第一行：icon + 天氣文字 */}
      <div className="flex items-center mb-2">
        <CloudHail className="w-20 h-20 mr-5" />
        <span className="text-lg font-bold mt-4">多 雲 偶 陣 雨
          <div className="text-sm mt-5">多雲偶陣雨，要留意材質與層次的搭配</div>
        </span>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-3xl font-bold ml-2">27℃</div>
        <a href="#" className="text-sm underline">看看穿搭建議 →</a>
      </div>
    </div>
  );
}
