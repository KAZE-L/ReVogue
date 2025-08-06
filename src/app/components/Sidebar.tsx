// components/Sidebar.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  X, Database, Settings, Edit,
  ChevronDown, ChevronUp, MoreHorizontal,
  Trash2, Edit as RenameIcon
} from 'lucide-react';
import Image from 'next/image';

// 定義聊天記錄類型
interface ChatRecord {
  date: string;
  title: string;
  id: string; // 添加唯一識別ID
}

const initialChatRecords: Record<string, ChatRecord[]> = {
  '五月, 2025': [
    { date: '05.30', title: '日常氣質穿搭', id: '1' },
    { date: '05.28', title: '雨天穿搭', id: '2' },
    { date: '05.26', title: '夏日簡約風', id: '3' },
    { date: '05.24', title: '開會的專業感穿搭', id: '4' },
  ],
  '四月, 2025': [
    { date: '04.18', title: '春日野餐穿搭', id: '5' },
    { date: '04.15', title: '簡約都會風', id: '6' },
    { date: '04.10', title: '轉涼天氣穿搭', id: '7' },
    { date: '04.05', title: '下午茶聚會穿搭', id: '8' },
  ],
  '三月, 2025': [
    {date: '03.05', title: '聚會穿搭', id: '9'},
  ],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  goHome: () => void;
}

export default function Sidebar({ isOpen, onClose, goHome }: SidebarProps) {
  const router = useRouter();
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [chatRecords, setChatRecords] = useState(initialChatRecords);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<{id: string, title: string} | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        setActiveMenu(null);
        setEditingRecord(null);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
    setActiveMenu(null); // 收起月份時同時關閉所有操作菜單
  };

  const toggleMenu = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發上層點擊事件
    setActiveMenu(activeMenu === recordId ? null : recordId);
  };

  const startRename = (record: ChatRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRecord({ id: record.id, title: record.title });
    setNewTitle(record.title);
    setActiveMenu(null);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !newTitle.trim()) return;

    setChatRecords(prev => {
      const updated = {...prev};
      for (const month in updated) {
        updated[month] = updated[month].map(record => 
          record.id === editingRecord.id ? {...record, title: newTitle} : record
        );
      }
      return updated;
    });

    setEditingRecord(null);
  };

  const handleDelete = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatRecords(prev => {
      const updated = {...prev};
      for (const month in updated) {
        updated[month] = updated[month].filter(record => record.id !== recordId);
      }
      return updated;
    });
    setActiveMenu(null);
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
    setEditingRecord(null);
  };

  return (
    <div 
      className={`sidebar-root${isOpen ? ' open' : ''}`}
      onClick={closeAllMenus} // 點擊側邊欄空白處關閉所有菜單
    >
      <div className="sidebar-header">
        <h1
          className="sidebar-title cursor-pointer"
          onClick={() => {
            goHome();
            closeAllMenus();
          }}
        >
          ReVogue
        </h1>
        <button onClick={onClose} className="sidebar-close-btn">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="sidebar-user">
        <Image src="/user.png" alt="User" width={32} height={32} className="sidebar-user-img" />
        <span className="sidebar-user-name">USER USER</span>
      </div>

      <div
        onClick={() => {
          goHome();
          closeAllMenus();
        }}
        className="sidebar-nav-item"
      >
        <Edit className="w-5 h-5" /> 新對話
      </div>

      <div
        onClick={() => {
          router.push('/userData');
          onClose();
          closeAllMenus();
        }}
        className="sidebar-nav-item"
      >
        <Database className="w-5 h-5" /> 個人數據
      </div>

      <div
        onClick={() => {
          router.push('/setting');
          onClose();
          closeAllMenus();
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
              {expandedMonths[month] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            {expandedMonths[month] && (
              <div className="sidebar-record-list">
                {records.map((record) => (
                  <div key={record.id} className="sidebar-record-item">
                    {editingRecord?.id === record.id ? (
                      <form onSubmit={handleRename} className="w-full">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          autoFocus
                          className="w-full p-1 border rounded"
                          onBlur={handleRename}
                        />
                      </form>
                    ) : (
                      <div>
                        <div className="sidebar-record-date">{record.date}</div>
                        <div className="sidebar-record-title">{record.title}</div>
                      </div>
                    )}
                    <div className="relative">
                      <button 
                        className="sidebar-record-more"
                        onClick={(e) => toggleMenu(record.id, e)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {activeMenu === record.id && (
                        <div className="absolute right-0 z-10 mt-2 w-32 bg-white rounded-md shadow-lg py-1">
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            onClick={(e) => startRename(record, e)}
                          >
                            <RenameIcon className="w-4 h-4 mr-2" />
                            重新命名
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                            onClick={(e) => handleDelete(record.id, e)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除
                          </button>
                        </div>
                      )}
                    </div>
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