'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { productSections } from '../../components/ProductSection/data'
import ProductSection from '../../components/ProductSection/ProductSection'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/product/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  if (loading) return <p className="p-6 text-gray-500">載入中...</p>
  if (error || !product) return <p className="p-6 text-red-500">找不到該商品。</p>

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <p className="text-blue-600 text-lg font-semibold">NT $ {product.price}</p>

          <p className="text-sm">原價 NT $ {product.originalPrice}</p>
          <p className="text-sm">購入地 {product.purchasePlace}</p>
          <p className="text-sm">尺寸 {product.size}</p>
          <p className="text-sm">品牌 {product.brand}</p>
          <p className="text-sm">瑕疵 / 污損 {product.condition}</p>
          <p className="text-sm">數量 {product.number}</p>
          <p className="text-sm">商品敘述 {product.description}</p>

          <div className="flex items-center space-x-2 pt-6">
            <p className="text-sm">賣家 </p>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-700">{product.seller}</span>
          </div>

          <div className="flex space-x-4 pt-4">
            <button className="w-full border rounded p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600">
              加入購物車
            </button>
            <button className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
              直接購買
            </button>
          </div>
        </div>
      </div>

      {/* 推薦商品區塊 */}
      <div className="max-w-7xl mx-auto px-6 pb-20 flex flex-col">
        {productSections.map((section, idx) => (
          <ProductSection key={idx} title={section.title} products={section.products} />
        ))}
      </div>
    </>
  )
}
