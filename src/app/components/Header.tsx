// components/Header.tsx
'use client';
import { Menu } from 'lucide-react';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="bg-white shadow px-4 py-4 flex items-center justify-between relative">
      <button onClick={onToggleSidebar} className="text-gray-700 mr-2">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
        CHATBOT
      </h1>
      <div className="w-6" />
    </header>
  );
}