// app/userData/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight, Database } from 'lucide-react';

export default function UserProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // ✅ 點擊 Logo 或新對話時：先關 sidebar 再導回 chatbot
  const goHome = () => {
    setSidebarOpen(false);
    router.push('/chatbot');
  };

  return (
    <div className="profile-main min-h-screen bg-white">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogoClick={goHome} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} goHome={goHome} />

      <div className="profile-content max-w-3xl mx-auto p-6">
        <div className="profile-header flex items-center text-xl font-semibold mb-6">
          <Database className="profile-header-icon w-6 h-6 mr-2" />
          個人數據
        </div>

        <div className="profile-section space-y-6">
          <div className="profile-block space-y-4">
            <Item label="性別" value="女性" />
            <Item label="身高" value="170 cm" />
            <Item label="膚色" custom={<div className="w-6 h-6 bg-yellow-200 rounded-full border" />} />
            <Item label="職業" value="學生" />

            <Item label="照片上傳" custom={
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <img key={i} src={`/img/sample${i + 1}.jpg`} alt="" className="w-10 h-10 rounded object-cover" />
                ))}
              </div>
            } />

            <Item label="風格偏好" custom={
              <div className="flex flex-wrap gap-2">
                {["極簡", "知性通勤", "日系", "...8+"]?.map((tag, i) => (
                  <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            } />

            <Item label="行程" value="未授權" />

            <Item label="你的衣櫃" custom={
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={`/img/closet${i + 1}.jpg`} alt="" className="w-10 h-10 rounded object-cover" />
                ))}
              </div>
            } />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ 單一項目元件
function Item({ label, value, custom }: { label: string; value?: string; custom?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-800">{value}</span>}
        {custom}
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
