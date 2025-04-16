import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 獲取商品列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');

    const where: any = {};
    if (category) where.category = category;
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('獲取商品列表錯誤:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}

// 創建新商品
export async function POST(request: Request) {
  try {
    const { name, price, description, category, images, sellerId } = await request.json();

    // 驗證必要字段
    if (!name || !price || !description || !category || !sellerId) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    // 創建商品
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        category,
        images: images || [],
        sellerId: parseInt(sellerId),
        styleTags: [],
        status: 'active'
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('創建商品錯誤:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}

async function handleImageUpload(file: File): Promise<string> {
  // TODO: 實現圖片上傳邏輯
  return 'https://example.com/image.jpg';
} 