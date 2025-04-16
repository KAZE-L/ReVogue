import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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