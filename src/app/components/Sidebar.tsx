// components/Sidebar.tsx
'use client';
import { useEffect } from 'react';
import { Menu } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onClose} className="text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4 border-b font-bold">風格篩選</div>
      <div className="p-4 border-b font-bold">個人數據</div>
      <div className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
        {/* 假資料區塊，可改為map渲染 */}
        <div className="font-semibold mb-2">May, 2025</div>
        <div className="space-y-1">
          <div className="text-sm">05.11 多雲開會日</div>
          <div className="text-sm">05.10 今天跑咖</div>
          <div className="text-sm">05.09 今天跑咖</div>
          <div className="text-sm">05.07 今天跑咖</div>
          <div className="text-sm">05.06 今天跑咖</div>
        </div>
      </div>
    </div>
  );
}