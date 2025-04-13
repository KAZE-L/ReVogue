'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProductPage() {
  const { id } = useParams() // 從 URL 取得商品的 ID
  const [product, setProduct] = useState<any>(null)

  // 當 ID 改變時重新抓取商品資料
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/product/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        // 如果未找到商品，可以進行錯誤處理
        console.error('Product not found')
      }
    }

    fetchProduct()
  }, [id])

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      <div className="flex">
        {/* 確保 product 有數據時才顯示圖片 */}
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-96 h-auto object-cover"
          />
        )}
        <div className="ml-8">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-2">{product.description}</p>
          <div className="text-lg font-semibold mt-4">NT ${product.price}</div>
        </div>
      </div>
    </div>
  )
}
