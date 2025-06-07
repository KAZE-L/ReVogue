// components/TrendyCard.tsx

import { EggFried } from "lucide-react";

export default function TrendyCard() {
  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-xl">
      <div className="text-md font-medium mb-14 flex items-center">
        <span className="font-bold">熱門穿搭</span>
        <EggFried className="w-5 h-5 ml-1" />
      </div>  
      <div className="text-sm">跟上流行了嗎，看看熱門穿搭</div>
    </div>
  );
}