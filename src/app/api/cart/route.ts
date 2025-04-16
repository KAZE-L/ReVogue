import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 避免在構建時執行
const skipDatabaseOps = () => {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
};

// 獲取購物車內容
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: '缺少用戶ID' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({ items: cartItems }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('獲取購物車錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// 添加商品到購物車
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
    const { userId, productId, quantity } = await request.json();

    const cartItem = await prisma.cart.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
      },
    });

    return new NextResponse(
      JSON.stringify(cartItem),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('添加購物車錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 