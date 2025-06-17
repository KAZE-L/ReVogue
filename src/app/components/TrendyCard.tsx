// components/TrendyCard.tsx

import { EggFried } from "lucide-react";

export default function TrendyCard({onTrigger}:{onTrigger: () => void}) {
  return (
    <div
      onClick={onTrigger}
      className="card-base card-gray card-hover"
    >
      <div className="card-title">
        <span className="font-bold">熱門穿搭</span>
        <EggFried className="card-icon-sm" />
      </div>  
      <div className="card-desc">跟上流行了嗎，看看熱門穿搭</div>
    </div>
  );
}