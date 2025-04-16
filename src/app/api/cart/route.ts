import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 獲取購物車內容
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID參數' },
        { status: 400 }
      );
    }

    const cartItems = await prisma.cart.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('獲取購物車錯誤:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}

// 添加商品到購物車
export async function POST(request: Request) {
  try {
    const { userId, productId, quantity } = await request.json();

    // 檢查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    // 創建或更新購物車項目
    const cartItem = await prisma.cart.upsert({
      where: {
        cart_user_product_unique: {
          userId: parseInt(userId),
          productId: parseInt(productId)
        }
      },
      update: {
        quantity: {
          increment: parseInt(quantity)
        }
      },
      create: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      }
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('添加購物車錯誤:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
} 