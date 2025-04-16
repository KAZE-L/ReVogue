import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// 添加调试日志
console.log('Current DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 避免在構建時執行
const skipDatabaseOps = () => {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
};

export async function POST(request: Request) {
  if (skipDatabaseOps()) {
    return new NextResponse(
      JSON.stringify({ status: 'success', message: '構建中' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // 創建測試用戶
    const hashedPassword = await bcrypt.hash('test123', 10);
    const timestamp = new Date().getTime();
    const user = await prisma.user.create({
      data: {
        email: `test${timestamp}@example.com`,
        password: hashedPassword,
        name: '測試用戶',
        role: 'buyer',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // 創建測試商品
    const product = await prisma.product.create({
      data: {
        name: '測試商品',
        price: 99.99,
        description: '這是一個測試商品',
        category: '測試類別',
        images: ['https://example.com/test.jpg'],
        sellerId: user.id,
        status: 'active',
        styleTags: ['casual', 'modern']
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: 'success',
        message: '測試數據已準備就緒',
        data: { user, product },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('創建測試數據錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 