import { Briefcase } from 'lucide-react';

export default function ScheduleCard({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-xl flex flex-col justify-between h-full">
      <div>
        <div className="text-md font-medium mb-10 flex items-center">
          <Briefcase className="w-5 h-5 mr-1" />
          <span className="font-bold">行程</span>
        </div>
        <div className="text-sm mb-7">14:00 進度會議，著整潔且具專業感的服裝較為適宜</div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onTrigger}
          className="text-sm underline cursor-pointer bg-transparent border-0 p-0"
        >
          看看穿搭建議 →
        </button>
      </div>
    </div>
  );
}
