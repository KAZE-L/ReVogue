'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b-2 border-black">
      {/* 左側：ReVogue Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">ReVogue</Link>
      </div>

      {/* 中間：導航欄 */}
      <nav className="flex space-x-8">
        <Link href="/" className="text-lg hover:text-gray-400">Home</Link>
        <Link href="/women" className="text-lg hover:text-gray-400">Women</Link>
        <Link href="/men" className="text-lg hover:text-gray-400">Men</Link>
      </nav>

      {/* 右側：搜索、喜好、購物車、賬號導航欄 */}
      <nav className="flex space-x-6">
        <Link href="/search" className="text-lg hover:text-gray-400">Search</Link>
        <div className="border-l-2 border-gray-400 h-6 mx-2"></div> {/* 右側的短竪線 */}
        <Link href="/likes" className="text-lg hover:text-gray-400">Likes</Link>
        <div className="border-l-2 border-gray-400 h-6 mx-2"></div> {/* 右側的短竪線 */}
        <Link href="/cart" className="text-lg hover:text-gray-400">Cart</Link>
        <div className="border-l-2 border-gray-400 h-6 mx-2"></div> {/* 右側的短竪線 */}
        <Link href="/account" className="text-lg hover:text-gray-400">Account</Link>
      </nav>
    </header>
  )
}
