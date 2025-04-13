import { NextResponse } from 'next/server'

type Product = {
  id: string
  image: string
  name: string
  description: string
  price: number
}

const products: Product[] = [
  {
    id: '1',
    image: 'https://example.com/image1.jpg',
    name: 'Logo印花圓領短袖T恤-白色',
    description: '這是一款簡約設計的圓領短袖T恤，適合各種場合穿著。',
    price: 650,
  },
  {
    id: '2',
    image: 'https://example.com/image2.jpg',
    name: 'Logo印花圓領短袖T恤-黑色',
    description: '這款黑色圓領T恤，簡約而經典。',
    price: 750,
  },
  {
    id: '3',
    image: 'https://example.com/image3.jpg',
    name: '運動風格T恤-灰色',
    description: '這款灰色運動風格T恤，簡約而經典',
    price: 500,
  },
  // 可以繼續加入更多商品
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const product = products.find((product) => product.id === id)

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}
