import ProductCard from './ProductCard'

export default function ProductList() {
  const products = [
    {
      id: '1',
      image: 'https://example.com/image1.jpg',
      name: 'Logo印花圓領短袖T恤-白色',
      price: 650,
    },
    {
      id: '2',
      image: 'https://example.com/image2.jpg',
      name: 'Logo印花圓領短袖T恤-黑色',
      price: 750,
    },
    {
      id: '3',
      image: 'https://example.com/image3.jpg',
      name: '運動風格T恤-灰色',
      price: 500,
    },
    {
        id: '4',
        image: 'https://example.com/image4.jpg',
        name: '女幼童裝 | 純棉小熊刺繡圓領短袖T恤-白色',
        price: 650,
    },
    {
        id: '5',
        image: 'https://example.com/image5.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '6',
        image: 'https://example.com/image6.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '7',
        image: 'https://example.com/image7.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '8',
        image: 'https://example.com/image8.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '9',
        image: 'https://example.com/image9.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '10',
        image: 'https://example.com/image10.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '11',
        image: 'https://example.com/image11.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    {
        id: '12',
        image: 'https://example.com/image12.jpg',
        name: '兒童裝 | Logo印花圓領大學T(1-14歲)-海軍藍',
        price: 650,
    },
    // 可以繼續加入更多商品
  ]

  return (
    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          image={product.image}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  )
}
