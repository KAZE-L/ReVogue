// app/components/ProductSection/data.ts

type Product = {
    id: number
    name: string
    price: string
    image: string
  }
  
  export type ProductSectionData = {
    title: string
    products: Product[]
  }
  /*這裡要再改*/
  const sampleProducts = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    name: `商品名稱 ${i + 1}`,
    price: `$${(1290 + i * 100).toFixed(0)}`,
    image: '/images/sample.jpg',
  }))
  
  export const productSections: ProductSectionData[] = [
    {
      title: '（相似推薦）',
      products: sampleProducts,
    },
    {
      title: 'Trending',
      products: sampleProducts,
    },
    {
      title: '@ 賣家ID_1234',
      products: sampleProducts,
    },
  ]
  