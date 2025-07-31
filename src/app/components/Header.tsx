// components/Header.tsx
'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({
  onToggleSidebar,
  onLogoClick,
}: {
  onToggleSidebar: () => void;
  onLogoClick: () => void;
}) {
  return (
    <header className="header-root">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="header-menu-btn">
          <Menu className="w-6 h-6" />
        </button>
        <h1
          className="header-title cursor-pointer"
          onClick={onLogoClick}
        >
          ReVogue
        </h1>
      </div>

      <div className="header-right" />
    </header>
  );
}
