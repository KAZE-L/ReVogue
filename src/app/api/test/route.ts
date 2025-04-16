import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 避免在構建時執行
export async function GET() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ status: 'success', message: '構建中' });
  }

  try {
    // 測試數據庫連接
    const users = await prisma.user.findMany({
      take: 1
    });
    
    return NextResponse.json({
      status: 'success',
      message: '數據庫連接正常',
      data: users
    });
  } catch (error) {
    console.error('測試錯誤:', error);
    return NextResponse.json(
      { error: '數據庫連接失敗' },
      { status: 500 }
    );
  }
} 