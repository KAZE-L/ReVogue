import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // 檢查測試用戶是否已存在
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    // 如果用戶不存在，則創建
    if (!user) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: '測試用戶',
          role: 'buyer'
        }
      });
    }

    // 檢查測試商品是否已存在
    let product = await prisma.product.findFirst({
      where: {
        name: '測試商品',
        sellerId: user.id
      }
    });

    // 如果商品不存在，則創建
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: '測試商品',
          description: '這是一個測試商品',
          price: 99.99,
          category: '測試類別',
          styleTags: ['測試標籤'],
          images: ['https://example.com/test.jpg'],
          sellerId: user.id
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      message: '測試數據已準備就緒',
      data: {
        user,
        product
      }
    });
  } catch (error) {
    console.error('創建測試數據錯誤:', error);
    return NextResponse.json(
      { error: '創建測試數據失敗' },
      { status: 500 }
    );
  }
} 