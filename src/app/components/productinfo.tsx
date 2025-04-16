'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai'

type ProductCardProps = {
  id: number
  name: string
  price: string
  image: string
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <Link
      href={`/productinfo/${id}`}
      className="block bg-white p-2 rounded-md shadow-sm relative group hover:shadow-md transition"
    >
      {/* 商品圖片 */}
      <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden">
        <Image src={image} alt={name} layout="fill" objectFit="cover" />
        <div className="absolute bottom-2 right-2 flex space-x-2 opacity-80 group-hover:opacity-100 z-10">
          <button
            className="bg-white p-1 rounded-full shadow"
            onClick={(e) => e.preventDefault()}
          >
            <AiOutlineHeart className="text-gray-800 text-base" />
          </button>
          <button
            className="bg-white p-1 rounded-full shadow"
            onClick={(e) => e.preventDefault()}
          >
            <AiOutlineShoppingCart className="text-gray-800 text-base" />
          </button>
        </div>
      </div>

      {/* 商品文字 */}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-500">{price}</p>
      </div>
    </Link>
  )
}
