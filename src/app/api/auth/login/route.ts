import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// 確保路由完全在運行時執行
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 添加调试日志
console.log('Login API initialized');
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL);

// 避免在構建時執行
const skipDatabaseOps = () => {
  const skip = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
  console.log('Skip database ops:', skip);
  return skip;
};

export async function POST(request: Request) {
  console.log('Received login request');
  
  // 立即返回成功響應，避免任何數據庫操作
  if (skipDatabaseOps()) {
    return new NextResponse(
      JSON.stringify({ status: 'success', message: '構建中' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    const { email, password } = await request.json();

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: '用戶不存在' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new NextResponse(
        JSON.stringify({ error: '密碼錯誤' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 返回用戶信息（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;
    return new NextResponse(
      JSON.stringify(userWithoutPassword),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('登錄錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 