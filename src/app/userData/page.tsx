'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight, Database } from 'lucide-react';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      <Header onToggleSidebar={() => {}} goHome={() => {}} />
      <Sidebar isOpen={false} onClose={() => {}} goHome={() => {}} />

      <div className="flex-1 ml-0 flex flex-col justify-start px-6 py-10 max-w-3xl mx-auto">
        <div className="flex items-center text-gray-600 text-sm mb-6">
          <Database className="w-5 h-5 mr-2" />
          個人數據
        </div>

        <div className="flex-1 flex justify-center px-6 py-10">
            <div className="space-y-4 text-sm">
            <Item label="性別" value="女性" />
            <Item label="身高" value="170 cm" />
            <Item label="膚色" custom={<div className="w-12 h-6 rounded bg-[#f0dfc9]" />} />
            <Item label="職業" value="學生" />

            <Item label="照片上傳" custom={
                <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                    <img key={i} src={`/img/sample${i + 1}.jpg`} alt="" className="w-8 h-8 rounded object-cover" />
                ))}
                </div>
            } />

            <Item label="風格偏好" custom={
                <div className="flex flex-wrap gap-1">
                {["極簡", "知性通勤", "日系", "...8+"]?.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {tag}
                    </span>
                ))}
                </div>
            } />

            <Item label="行程" value="未授權" />

            <Item label="你的衣櫃" custom={
                <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                    <img key={i} src={`/img/closet${i + 1}.jpg`} alt="" className="w-8 h-8 rounded object-cover" />
                ))}
                </div>
            } />
            </div>
            </div>
            </div>
        </div>
  );
}

function Item({ label, value, custom }: { label: string; value?: string; custom?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 py-3">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center space-x-2">
        {value && <span className="text-gray-500">{value}</span>}
        {custom}
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
