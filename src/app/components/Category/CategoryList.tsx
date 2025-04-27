// app/components/category/CategoryList.tsx
import Link from 'next/link'
import { categories } from './data'  // 引入資料檔案

const CategoryList: React.FC = () => {
  return (
    <section className="flex gap-4 overflow-x-auto px-6 py-4">
      {categories.map((category, idx) => (
        <Link key={idx} href={category.link} passHref>
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xs text-center flex-shrink-0 cursor-pointer">
            {category.name}
          </div>
        </Link>
      ))}
    </section>
  )
}

export default CategoryList
