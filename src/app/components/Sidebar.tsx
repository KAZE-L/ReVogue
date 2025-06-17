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
      className={`sidebar-root${isOpen ? ' open' : ''}`}
    >
      <div className="sidebar-header">
        <h1
          className="sidebar-title"
          onClick={() => {
            goHome();
          }}
        >
          ReVogue
        </h1>
        <button onClick={onClose} className="sidebar-close-btn" aria-label="Close Sidebar">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="sidebar-user">
  <Image src="/user.png" alt="User photo" width={32} height={32} className="sidebar-user-img" />
  <span className="sidebar-user-name">USER USER</span>
</div>

      <div
        onClick={() => {
          goHome();
          onClose();
        }}
        className="sidebar-nav-item"
      >
        <Edit className="w-5 h-5" /> 新對話
      </div>

      <div
        onClick={() => {
          router.push('/userData');
          onClose();
        }}
        className="sidebar-nav-item"
      >
        <Database className="w-5 h-5" /> 個人數據
      </div>

      <div
        onClick={() => {
          router.push('/setting');
          onClose();
        }}
        className="sidebar-nav-item"
      >
        <Settings className="w-5 h-5" /> 設定
      </div>

      <div className="sidebar-records">
        <h2 className="sidebar-record-month">聊天記錄</h2>
        {Object.entries(chatRecords).map(([month, records]) => (
          <div key={month} className="mb-2">
            <div
              className="sidebar-record-toggle"
              onClick={() => toggleMonth(month)}
            >
              <div className="sidebar-record-month-label">{month}</div>
              {expandedMonths[month] ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            {expandedMonths[month] && (
              <div className="sidebar-record-list">
                {records.map(({ date, title }) => (
                  <div key={date} className="sidebar-record-item">
                    <div>
                      <div className="sidebar-record-date">{date}</div>
                      <div className="sidebar-record-title">{title}</div>
                    </div>
                    <button className="sidebar-record-more" aria-label={`More options for ${title}`}>
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
