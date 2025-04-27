'use client'

import ProductCard from '../productinfo'

type Product = {
  id: number
  name: string
  price: string
  image: string
}

interface ProductSectionProps {
  title: string
  products: Product[]
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  return (
    <section className="px-6 py-2">

      <h2 className="text-lg font-semibold mb-3 pt-6">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </section>
  )
}


export default ProductSection


