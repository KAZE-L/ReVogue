// components/DailyCard.tsx

import { EggFried } from "lucide-react";

export default function DailyCard({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div
      onClick={onTrigger}
      className="card-base card-gray card-hover"
    >
      <div className="card-title">
        <span className="font-bold">穿搭隨拍</span>
        <EggFried className="card-icon-sm" />
      </div>  
      <div className="card-desc">今天穿了什麼......</div>
    </div>
  );
}