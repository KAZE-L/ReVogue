// app/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import InputBox from './components/InputBox';

export default function HomePage() {
  const [showDetails, setShowDetails] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out flex flex-col ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-6 p-6">
              <ChatMessage showDetails={showDetails} setShowDetails={setShowDetails} />
            </div>
            <div className="p-6 sticky bottom-0 bg-gray-50">
              <InputBox />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}