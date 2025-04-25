import { NextRequest, NextResponse } from 'next/server'

type Product = {
  id: string
  images: string[]
  name: string
  price: number
  originalPrice: number
  purchasePlace: string
  size: string
  brand: string
  condition: string
  number: number
  description: string
  seller: string
}

const products: Product[] = [
  {
    id: "1",
    images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
    "https://example.com/image4.jpg"
      ],
    name: "Logo印花圓領短袖T恤-白色",
    price: 650,
    originalPrice: 700,
    purchasePlace: "購入地",
    size: "L",
    brand: "品牌",
    condition: "全新",
    number: 2,
    description: "這是商品敘述文字，用來展示商品詳情。",
    seller: "賣家ID_1234",
  },
  {
    id: '2',
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg"
      ],
    name: 'Logo印花圓領短袖T恤-黑色',
    price: 750,
    originalPrice: 800,
    purchasePlace: "購入地",
    size: "L",
    brand: "品牌",
    condition: "全新",
    number: 2,
    description: "這是商品敘述文字，用來展示商品詳情。",
    seller: "賣家ID_1234",
  },
  {
    id: '3',
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg"
      ],
    name: '運動風格T恤-灰色',
    price: 500,
    originalPrice: 700,
    purchasePlace: "購入地",
    size: "L",
    brand: "品牌",
    condition: "全新",
    number: 2,
    description: "這是商品敘述文字，用來展示商品詳情。",
    seller: "賣家ID_1234",
    },
]

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const product = products.find((product) => product.id === id)

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}
