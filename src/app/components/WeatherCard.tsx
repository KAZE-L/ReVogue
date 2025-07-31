import { CloudHail } from "lucide-react";

export default function WeatherCard({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div className="bg-blue-300 rounded-xl p-5 flex flex-col justify-between" style={{ minHeight: '150px' }}>
      {/* 第一行：天气图标和文字 */}
      <div className="flex items-start gap-4">
        <CloudHail className="text-white flex-shrink-0" size={64} />
        <div>
          <h3 className="text-xl font-bold text-white mt-4">多 雲 偶 陣 雨</h3>
          <p className="text-white mt-4">多雲偶陣雨，要留意材質與層次的搭配</p>
        </div>
      </div>

      {/* 第二行：温度和按钮 */}
      <div className="flex justify-between items-end">
        <span className="text-3xl text-white font-bold">27℃</span>
        <button
          type="button"
          onClick={onTrigger}
          className="card-btn cursor-pointer bg-transparent border-0 p-0 text-white"
        >
          看看穿搭建議 →
        </button>
      </div>
    </div>
  );
}