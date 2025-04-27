import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 避免在構建時執行
const skipDatabaseOps = () => {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
};

export async function GET(request: Request) {
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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return new NextResponse(
      JSON.stringify({ users }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('測試錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 