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
    <div className="chatbot-root">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} goHome={goHome} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} goHome={goHome} />

      <div
        className={`chatbot-main ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <main className="chatbot-main-content">
          {!showChat ? (
            <>
              <div className="chatbot-card-row md-2">
                <WeatherCard onTrigger={() => handleCardClick('weather')} />
                <ScheduleCard onTrigger={() => handleCardClick('schedule')} />
              </div>
              <div className="chatbot-card-row md-3">
                <RandomCard onTrigger={() => handleCardClick('random')} />
                <TrendyCard onTrigger={() => handleCardClick('trendy')} />
                <DailyCard onTrigger={() => handleCardClick('daily')} />
              </div>
              <div className="chatbot-input-container">
                <InputBox onSend={handleSendMessage} />
              </div>
            </>
          ) : (
            <>
              <div
                className="chatbot-messages"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chatbot-message ${msg.role === 'user' ? 'user' : 'bot'}`}
                  >
                    {typeof msg.content === 'string' ? (
                      <div
                        className={`chatbot-message-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}
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
              <div className="chatbot-input-container-bottom">
                <InputBox onSend={handleSendMessage} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
