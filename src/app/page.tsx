'use client'

import BannerCarousel from './components/BannerCarousel'
import CategoryList  from './components/Category/CategoryList'
import { productSections } from './components/ProductSection/data'
import ProductSection from './components/ProductSection/ProductSection'


export default function HomePage() {
  const categories = ['Tops', 'Bottoms', 'Shoes', 'Bags', 'Accessories', 'New In', 'Sale', 'Unisex', 'Winter', 'Summer','Autumn', 'Fall', 'Winter']
  const products = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    name: `商品名稱 ${i + 1}`,
    price: `$${(1290 + i * 100).toFixed(0)}`,
    image: '/images/sample.jpg', // 真實圖片路徑
  }))

  return (
      <div className="min-h-screen flex flex-col">
      {/* Banner 區塊 */}
      <main className="w-full">
      {/* 輪播橫幅 */}
        <section className="w-full px-4 py-6">
          <BannerCarousel />
        </section>
      </main>

      {/* 分類區塊 */}
      <CategoryList />

      {/* 推薦商品區塊 */}
      {productSections.map((section, idx) => (
  <ProductSection key={idx} title={section.title} products={section.products} />
))}

      {/* Footer 區塊 */}
      <footer className="mt-10 py-6 text-center text-sm text-gray-500 border-t">
        © 2025 ReVogue. All rights reserved.
      </footer>
    </div>
  )
}
