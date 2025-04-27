'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { productSections } from '../../components/ProductSection/data'
import ProductSection from '../../components/ProductSection/ProductSection'

export default function ProductPage() {
  const router = useRouter()
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
      <div className="max-w-7xl mx-auto p-6">
        {/* 返回按鈕區塊，單獨一個 div */}
        <div className="mb-6 ml-[-80]">
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
            aria-label="返回"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-7 7 7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="ml-[-80px]">
            <div className="w-[667px] h-[500px] rounded-xl bg-gray-200">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-1 pt-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[160px] h-[180px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 右側商品資訊 */}
          <div className="text-sm">
            <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
            <p className="pt-3 text-blue-600 text-lg font-semibold mb-6">NT$ {product.price}</p>

            {/* 商品詳細資訊 */}
            <div className="flex flex-col space-y-8 text-gray-700">
              {/* 每一列 */}
              <div className="flex items-start">
                <div className="w-24 font-medium">原價</div>
                <div>NT$ {product.originalPrice}</div>
              </div>

              <div className="flex items-start">
                <div className="w-24 font-medium">購入地</div>
                <div>{product.purchasePlace}</div>
              </div>

              <div className="flex items-start">
                <div className="w-24 font-medium">尺寸</div>
                <div>{product.size}</div>
              </div>

              <div className="flex items-start">
                <div className="w-24 font-medium">品牌</div>
                <div>{product.brand}</div>
              </div>

              <div className="flex items-start">
                <div className="w-24 font-medium">瑕疵 / 汙損</div>
                <div>{product.condition}</div>
              </div>

              <div className="flex items-start">
                <div className="w-24 font-medium">數量</div>
                <div>{product.number}</div>
              </div>

              <div className="flex items-start">
                <div className="w-24 font-medium">商品敘述</div>
                <div>{product.description}</div>
              </div>

              <div className="flex items-center pt-6">
                <div className="w-24 font-medium">賣家</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <span>{product.seller}</span>
                  <button
                    onClick={() => {
                      if (product?.sellerId) {
                        router.push(`/chat/${product.sellerId}`)
                      }
                    }}
                    className="p-1.5 border rounded-full hover:bg-gray-100 flex items-center justify-center"
                    aria-label="私訊賣家"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.257 0-2.45-.232-3.528-.65L3 20l1.518-4.546C3.551 14.273 3 13.183 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 按鈕區塊 */}
            <div className="flex flex-col pt-20">
              <div className="flex space-x-4">
                {/* 加入購物車按鈕 */}
                <button className="w-[226px] border-2 border-blue-800 text-blue-800 rounded-full p-1.5 flex items-center justify-center space-x-2 hover:bg-gray-100 font-semibold">
                  <span>加入購物車</span>
                </button>

                {/* 直接購買按鈕 */}
                <button className="w-[226px] bg-blue-800 text-white rounded-full p-2 hover:bg-blue-700 font-semibold">
                  直接購買
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 推薦商品區塊 */}
        <div className="max-w-7xl mx-auto px-6 pb-20 flex flex-col">
          {productSections.map((section, idx) => (
            <ProductSection key={idx} title={section.title} products={section.products} />
          ))}
        </div>
      </div>
    </>
  )
}
