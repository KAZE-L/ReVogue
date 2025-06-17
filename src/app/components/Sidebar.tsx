'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { X, Database, Shirt, ChevronDown, ChevronUp, MoreHorizontal, Edit, Settings } from 'lucide-react';
import Image from 'next/image';


const chatRecords: Record<string, { date: string; title: string }[]> = {
  '五月, 2025': [
    { date: '05.30', title: '日常氣質穿搭' },
    { date: '05.28', title: '雨天穿搭' },
    { date: '05.26', title: '夏日簡約風' },
    { date: '05.24', title: '開會的專業感穿搭' },
  ],
  '四月, 2025': [
    { date: '04.18', title: '春日野餐穿搭' },
    { date: '04.15', title: '簡約都會風' },
    { date: '04.10', title: '轉涼天氣穿搭' },
    { date: '04.05', title: '下午茶聚會穿搭' },
  ],
  '三月, 2025': [],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  goHome: () => void;
}

export default function Sidebar({ isOpen, onClose, goHome }: SidebarProps) {
  const router = useRouter();
  
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => {
            goHome();
          }}
        >
          ReVogue
        </h1>
        <button onClick={onClose} className="text-gray-700" aria-label="Close Sidebar">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src="/user.png" alt="User photo" width={32} height={32} className="rounded-full" />
          <span className="text-sm font-semibold">USER USER</span>
        </div>
      </div>

      <div
        onClick={() => {
          goHome();
          onClose();
        }}
        className="flex items-center px-4 py-3 text-sm text-zinc-600 gap-3 cursor-pointer"
      >
        <Edit className="w-5 h-5" /> 新對話
      </div>

      <div
        onClick={() => {
          router.push('/userData');
          onClose();
        }}
        className="flex items-center px-4 py-3 text-sm text-zinc-600 gap-3 cursor-pointer"
      >
        <Database className="w-5 h-5" /> 個人數據
      </div>

      <div
        onClick={() => {
          router.push('/setting');
          onClose();
        }}
        className="flex items-center px-4 py-3 text-sm text-zinc-600 gap-3 cursor-pointer"
      >
        <Settings className="w-5 h-5" /> 設定
      </div>

      <div className="overflow-y-auto h-[calc(100%-12rem)] px-4 py-3">
        <h2 className="text-xs text-gray-400">聊天記錄</h2>
        {Object.entries(chatRecords).map(([month, records]) => (
          <div key={month} className="mb-2">
            <div
              className="flex justify-between items-center mt-6 cursor-pointer"
              onClick={() => toggleMonth(month)}
            >
              <div className="text-sm font-semibold text-gray-500">{month}</div>
              {expandedMonths[month] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedMonths[month] && (
              <div className="mt-6 space-y-4">
                {records.map(({ date, title }) => (
                  <div key={date} className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-semibold mb-1">{date}</div>
                      <div className="text-gray-600 text-xs">{title}</div>
                    </div>
                    <button aria-label={`More options for ${title}`}>
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
