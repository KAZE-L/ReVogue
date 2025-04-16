import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 創建新訂單
export async function POST(request: Request) {
  try {
    const { cartItems, paymentMethod, shippingAddress, buyerId } = await request.json();

    // 驗證輸入
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: '購物車為空' },
        { status: 400 }
      );
    }

    // 獲取第一個商品的賣家 ID
    const firstProduct = await prisma.product.findUnique({
      where: { id: cartItems[0].productId }
    });

    if (!firstProduct) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    // 計算總金額
    const totalAmount = await calculateTotalAmount(cartItems);

    // 創建訂單項
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const price = await getProductPrice(parseInt(item.productId));
        return {
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          price
        };
      })
    );

    // 創建訂單
    const order = await prisma.order.create({
      data: {
        buyerId: parseInt(buyerId),
        sellerId: firstProduct.sellerId,
        totalAmount,
        paymentMethod,
        shippingAddress,
        status: 'pending',
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('創建訂單錯誤:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}

async function calculateTotalAmount(cartItems: any[]) {
  let total = 0;
  for (const item of cartItems) {
    const price = await getProductPrice(parseInt(item.productId));
    total += price * parseInt(item.quantity);
  }
  return total;
}

async function getProductPrice(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { price: true }
  });
  return product?.price || 0;
} 