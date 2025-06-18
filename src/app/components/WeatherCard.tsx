// components/WeatherCard.tsx

import { CloudHail } from "lucide-react";

export default function WeatherCard({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div className="card-base card-blue" style={{minHeight:'150px'}}>
      {/* 第一行：icon + 天氣文字 */}
      <div className="card-title card-title-margin">
        <CloudHail className="card-icon-lg" />
        <span className="card-title card-title-mt">多 雲 偶 陣 雨
          <div className="card-desc card-desc-mt">多雲偶陣雨，要留意材質與層次的搭配</div>
        </span>
      </div>

      <div className="card-flex-row">
        <div className="card-temp">27℃</div>
        <button onClick={onTrigger} className="card-btn">
          看看穿搭建議 →
        </button>
      </div>
    </div>
  );
}
