import { Briefcase } from 'lucide-react';

export default function ScheduleCard({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div className="card-base card-gray h-full">
      <div>
        <div className="card-title card-title-margin-schedule">
          <Briefcase className="w-5 h-5 mr-1" />
          <span className="font-bold">行程</span>
        </div>
        <div className="card-desc card-desc-margin">14:00 進度會議，著整潔且具專業感的服裝較為適宜</div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onTrigger}
          className="card-btn cursor-pointer bg-transparent border-0 p-0"
        >
          看看穿搭建議 →
        </button>
      </div>
    </div>
  );
}
