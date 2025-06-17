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
    <header className="header-root">
      {/* 左側區域：menu icon + ReVogue */}
      <div className="header-left">
        <button onClick={onToggleSidebar} className="header-menu-btn">
          <Menu className="w-6 h-6" />
        </button>
        <h1
          className="header-title"
          onClick={goHome}
        >
          ReVogue
        </h1>
      </div>

      {/* 右側預留空間（例如帳號、設定） */}
      <div className="header-right" />
    </header>
  );
}
