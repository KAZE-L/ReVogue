import ProductCard from './ProductCard'

export default function ProductList() {
  return (
    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {[...Array(16)].map((_, i) => (
        <ProductCard key={i} />
      ))}
    </div>
  )
}
