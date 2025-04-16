import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 避免在構建時執行
const skipDatabaseOps = () => {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
};

// 獲取商品列表
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
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(keyword && {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        }),
      },
    });

    return new NextResponse(
      JSON.stringify({ products }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('獲取商品列表錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// 創建新商品
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
    const { name, price, description, category, images, sellerId, styleTags } = await request.json();

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        category,
        images,
        sellerId,
        status: 'active',
        styleTags: styleTags || []
      },
    });

    return new NextResponse(
      JSON.stringify(product),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('創建商品錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleImageUpload(file: File): Promise<string> {
  // TODO: 實現圖片上傳邏輯
  return 'https://example.com/image.jpg';
} 