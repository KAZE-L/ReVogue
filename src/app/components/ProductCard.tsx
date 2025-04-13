'use client'

import { Card, CardContent } from '@/app/components/ui/card'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

type ProductCardProps = {
  id: string
  image: string
  name: string
  price: number
}

export default function ProductCard({ id, image, name, price }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [inCart, setInCart] = useState(false)

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group transition-shadow duration-300 hover:shadow-lg overflow-hidden p-0"
    >
      {/* 僅包裹圖片區域的 Link，點擊圖片後跳轉到商品頁面 */}
      <Link href={`/product/${id}`} className="block">
        <div className="aspect-[4/5] bg-gray-200 relative">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      </Link>

      {/* 愛心和購物車按鈕，放置在圖片區域的右下角 */}
      <div
        className={`absolute bottom-2 right-2 flex gap-2 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // 阻止點擊事件冒泡，防止觸發 Link
            setLiked(!liked);
          }}
          className={`p-1 rounded-full shadow hover:bg-gray-100 ${liked ? 'bg-red-100' : 'bg-white'}`}
        >
          <Heart
            className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // 阻止點擊事件冒泡，防止觸發 Link
            setInCart(!inCart);
          }}
          className={`p-1 rounded-full shadow hover:bg-gray-100 ${inCart ? 'bg-yellow-100' : 'bg-white'}`}
        >
          <ShoppingCart
            className={`w-4 h-4 ${inCart ? 'fill-yellow-400 text-yellow-500' : 'text-gray-700'}`}
          />
        </button>
      </div>

      <CardContent className="p-2 pt-0">
        <div className="text-sm">{name}</div>
        <div className="text-sm text-gray-500 mt-5">NT ${price}</div>
      </CardContent>
    </Card>
  )
}
