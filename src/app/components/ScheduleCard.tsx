// components/ScheduleCard.tsx

import { Briefcase} from 'lucide-react';

export default function ScheduleCard() {
  
  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-xl">
      <div className="text-md font-medium mb-10 flex items-center">
        <Briefcase className="w-5 h-5 mr-1" />
        <span className="font-bold">行程</span>
      </div>
      <div className="text-sm mb-7">14:00 進度會議，著整潔且具專業感的服裝較為適宜</div>
      <a href="#" className="text-sm flex justify-end underline">看看穿搭建議 →</a>
    </div>
  );
}