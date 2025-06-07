// app/chatbot/page.tsx
'use client';
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WeatherCard from './components/WeatherCard';
import ScheduleCard from './components/ScheduleCard';
import RandomCard from './components/RandomCard';
import TrendyCard from './components/TrendyCard';
import DailyCard from './components/DailyCard';
import InputBox from './components/InputBox';

export default function ChatbotPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1" />

      <div className="p-4 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <WeatherCard />
          <ScheduleCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <RandomCard />
          <TrendyCard />
          <DailyCard />
        </div>
        <div className="w-full mt-12 pb-8">
          <InputBox />
        </div>
      </div>
    </div>
  );
}
