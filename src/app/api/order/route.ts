import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 避免在構建時執行
const skipDatabaseOps = () => {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
};

// 創建新訂單
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
    const { cartItems, paymentMethod, shippingAddress, buyerId } = await request.json();

    // 驗證輸入
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: '購物車為空' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 獲取第一個商品的賣家 ID
    const firstProduct = await prisma.product.findUnique({
      where: { id: cartItems[0].productId }
    });

    if (!firstProduct) {
      return new NextResponse(
        JSON.stringify({ error: '商品不存在' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 先获取商品价格并计算总金额
    const totalAmount = await calculateTotalAmount(cartItems);

    // 創建訂單
    const order = await prisma.order.create({
      data: {
        buyerId: parseInt(buyerId),
        sellerId: firstProduct.sellerId,
        status: 'pending',
        paymentMethod,
        shippingAddress,
        totalAmount,
        items: {
          create: cartItems.map((item: any) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: item.price || firstProduct.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 清空購物車
    await prisma.cart.deleteMany({
      where: {
        userId: parseInt(buyerId),
        productId: {
          in: cartItems.map((item: any) => parseInt(item.productId))
        }
      }
    });

    return new NextResponse(
      JSON.stringify({
        id: order.id,
        status: order.status,
        totalAmount,
        items: order.items,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('創建訂單錯誤:', error);
    return new NextResponse(
      JSON.stringify({ error: '服務器錯誤' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function calculateTotalAmount(cartItems: any[]) {
  let total = 0;
  for (const item of cartItems) {
    const price = await getProductPrice(parseInt(item.productId));
    if (price) {
      total = total + (price * parseInt(item.quantity));
    }
  }
  return total;
}

async function getProductPrice(productId: number): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { price: true }
  });
  return product?.price ? Number(product.price) : 0;
} 