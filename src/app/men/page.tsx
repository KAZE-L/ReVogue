import '@/styles/globals.css'

import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import ProductList from '../components/ProductList'

export default function MenPage() {
  return (
      <div className="flex">
        <FilterSidebar />
        <ProductList />
      </div>
  )
}
