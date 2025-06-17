'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({
  onToggleSidebar,
  goHome,
}: {
  onToggleSidebar: () => void;
  goHome: () => void;
}) {
  return (
    <header className="bg-white shadow px-4 py-4 flex items-center justify-between">
      {/* 左側區域：menu icon + ReVogue */}
      <div className="flex items-center space-x-3">
        <button onClick={onToggleSidebar} className="text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={goHome}
        >
          ReVogue
        </h1>
      </div>

      {/* 右側預留空間（例如帳號、設定） */}
      <div className="w-6" />
    </header>
  );
}
