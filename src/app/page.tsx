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

export default function ChatbotPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1" />

      <div className="p-4 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-1">
            <WeatherCard />
          </div>
          <div className="md:col-span-2">
            <ScheduleCard />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <RandomCard />
          <TrendyCard />
          <DailyCard />
        </div>
        <div className="w-full mt-12 pb-8">
          <input
            type="text"
            placeholder="詢問任何穿搭建議"
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
    </div>
  );
}
