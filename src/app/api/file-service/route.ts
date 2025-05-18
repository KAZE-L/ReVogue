import { NextRequest, NextResponse } from 'next/server';

interface RateLimiter {
  ip: string;
  count: number;
  lastReset: number;
}

// 儲存IP訪問計數
const rateLimitStore = new Map<string, RateLimiter>();

// 速率限制配置
const RATE_LIMIT_MAX = 10; // 最大請求次數
const RATE_LIMIT_WINDOW = 60 * 1000; // 時間窗口（毫秒）

/**
 * 速率限制中間件
 */
export function rateLimit(req: NextRequest) {
  const ip = req.ip || 'anonymous';
  const now = Date.now();

  // 獲取或創建此IP的記錄
  const limiter = rateLimitStore.get(ip) || {
    ip,
    count: 0,
    lastReset: now
  };

  // 如果已過期，重置計數器
  if (now - limiter.lastReset > RATE_LIMIT_WINDOW) {
    limiter.count = 0;
    limiter.lastReset = now;
  }

  // 增加計數
  limiter.count++;
  rateLimitStore.set(ip, limiter);

  // 檢查是否超過限制
  if (limiter.count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: '請求過於頻繁，請稍後再試' },
      { status: 429 }
    );
  }

  return null;
} 