// components/RandomCard.tsx
import { Dices } from 'lucide-react';

export default function RandomCard({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div
      onClick={onTrigger}
      className="card-base card-gray card-hover"
    >
      <div className="card-title card-title-margin">
        <span className="font-bold">隨機</span>
        <Dices className="w-5 h-5 ml-1" />
      </div>
      <div className="card-desc">想嘗試不同風格？試試隨機推薦！</div>
    </div>
  );
}
