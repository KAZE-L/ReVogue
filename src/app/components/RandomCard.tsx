// components/RandomCard.tsx

import {Dices} from 'lucide-react';

export default function RandomCard() {
  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-xl">
      <div className="text-md font-medium mb-14 flex items-center">
        <span className="font-bold">隨機</span>
        <Dices className="w-5 h-5 ml-1" />
      </div>  
      <div className="text-sm">想嘗試不同風格？試試隨機推薦！</div>
    </div>
  );
}