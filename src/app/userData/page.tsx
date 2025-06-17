'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight, Database } from 'lucide-react';

export default function UserProfilePage() {
  return (
    <div className="profile-main">
      <Header onToggleSidebar={() => {}} goHome={() => {}} />
      <Sidebar isOpen={false} onClose={() => {}} goHome={() => {}} />

        <div className="profile-content">
            <div className="profile-header">
            <Database className="profile-header-icon" />
            個人數據
            </div>
        </div>

        <div className="profile-section">
            <div className="profile-block">
                <Item label="性別" value="女性" />
                <Item label="身高" value="170 cm" />
                <Item label="膚色" custom={<div className="profile-color-demo" />} />
                <Item label="職業" value="學生" />

                <Item label="照片上傳" custom={
                    <div className="profile-photo-list">
                    {[...Array(3)].map((_, i) => (
                        <img key={i} src={`/img/sample${i + 1}.jpg`} alt="" className="w-8 h-8 rounded object-cover" />
                    ))}
                    </div>
                } />

                <Item label="風格偏好" custom={
                    <div className="profile-tag-list">
                    {["極簡", "知性通勤", "日系", "...8+"]?.map((tag, i) => (
                        <span key={i} className="profile-tag">
                        {tag}
                        </span>
                    ))}
                    </div>
                } />

                <Item label="行程" value="未授權" />

                <Item label="你的衣櫃" custom={
                    <div className="profile-photo-list">
                    {[...Array(5)].map((_, i) => (
                        <img key={i} src={`/img/closet${i + 1}.jpg`} alt="" className="w-8 h-8 rounded object-cover" />
                    ))}
                    </div>
                } />
                </div>
            </div>
        </div>
        
  );
}

function Item({ label, value, custom }: { label: string; value?: string; custom?: React.ReactNode }) {
  return (
    <div className="profile-item">
      <span className="profile-label">{label}</span>
      <div className="profile-item-right">
        {value && <span className="profile-value">{value}</span>}
        {custom}
        <ChevronRight className="profile-arrow" />
      </div>
    </div>
  );
}
