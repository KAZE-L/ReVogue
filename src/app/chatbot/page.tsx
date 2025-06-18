// 更新後的 ChatbotPage.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WeatherCard from '../components/WeatherCard';
import ScheduleCard from '../components/ScheduleCard';
import RandomCard from '../components/RandomCard';
import TrendyCard from '../components/TrendyCard';
import DailyCard from '../components/DailyCard';
import InputBox from '../components/InputBox';
import MultiAgentChat from '../components/MultiAgentChat';


type Message = {
  role: 'user' | 'bot';
  content: string | React.ReactNode;
};

const presetQuestions = {
  weather:'根據今天的天氣，請推薦我一套穿搭',
  schedule:'根據今天的行程，我應該穿什麽？',
  random: '請推薦一套穿搭給我',
  trendy: '現在最流行的是什麼穿搭？',
  daily: '幫我看看今天的穿搭怎麼樣',
};

export default function ChatbotPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialType, setInitialType] = useState<keyof typeof presetQuestions | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (type: keyof typeof presetQuestions) => {
    setInitialType(type);
    setShowChat(true);
    setMessages([{
      role: 'user',
      content: presetQuestions[type],
    }]);
  };

  const goHome = () => {
    setShowChat(false);
    setSidebarOpen(false);
    setMessages([]);
    setInitialType(null);
  };

  const handleSendMessage = (userMessage: string) => {
  if (!userMessage.trim()) return;

  setShowChat(true);
  setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        content: <MultiAgentChat />,
      },
    ]);
  }, 800);
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} goHome={goHome} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} goHome={goHome} />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} flex flex-col justify-end`}
      >
        <main className="p-4 max-w-4xl mx-auto w-full">
          {!showChat ? (
            <>
              <div className="flex flex-col items-center text-md font-bold mt-10 mb-12">六位穿搭顧問已上線，來點風格靈感吧！</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <WeatherCard onTrigger={() => handleCardClick('weather')} />
                <ScheduleCard onTrigger={() => handleCardClick('schedule')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <RandomCard onTrigger={() => handleCardClick('random')} />
                <TrendyCard onTrigger={() => handleCardClick('trendy')} />
                <DailyCard onTrigger={() => handleCardClick('daily')} />
              </div>
              <div className="w-full mt-10 pb-8">
                <InputBox onSend={handleSendMessage} />
              </div>
            </>
          ) : (
            <>
              <div
                className="w-full flex flex-col space-y-3 mb-4 overflow-y-auto pr-2"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] ${
                      msg.role === 'user' ? 'text-right ml-auto' : 'text-left'
                    }`}
                  >
                    {typeof msg.content === 'string' ? (
                      <div
                        className={`p-3 rounded-lg ${
                          msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                ))}
                {initialType && <MultiAgentChat />}
                <div ref={messagesEndRef} />
              </div>
              <div className="w-full mt-4 pb-8">
                <InputBox onSend={handleSendMessage} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
