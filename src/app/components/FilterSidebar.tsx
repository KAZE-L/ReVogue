"use client";

type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="mt-6">
    <h2 className="font-bold mb-2">{title}</h2>
    {children}
  </div>
)

export default function FilterSidebar() {
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-white",
    "bg-black",
    "bg-gray-500",
  ]

  const [selectedColor, setSelectedColor] = useState<string | null>(null)


  return (
    <aside className="w-64 p-4 mr-2 border-r border-gray-200 -translate-x-2">
      {/* Categories 區塊 */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
      >
        <h2 className="font-bold">CATEGORIES</h2>
        {isCategoryOpen ? (
          <Minus className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </div>

      {isCategoryOpen && (
        <ul className="space-y-2">
          <li className="cursor-pointer hover:text-gray-400">T-shirt</li>
          <li className="cursor-pointer hover:text-gray-400">Sweats</li>
          <li className="cursor-pointer hover:text-gray-400">Shirts & Blouses</li>
          <li className="cursor-pointer hover:text-gray-400">Bottoms</li>
          <li className="cursor-pointer hover:text-gray-400">Dress & Skirts</li>
          <li className="cursor-pointer hover:text-gray-400">Outerwear</li>
          <li className="cursor-pointer hover:text-gray-400">Sweaters & Cardigans</li>
          <li className="cursor-pointer hover:text-gray-400">Coats & Jackets</li>
          <li className="cursor-pointer hover:text-gray-400">Shoes</li>
          <li className="cursor-pointer hover:text-gray-400">Accessories</li>
        </ul>
      )}

      <h2 className="font-bold mt-6 mb-2">SHOP BY</h2>

      <FilterSection title="Brand">
        <ul className="space-y-1">
          <li className="cursor-pointer hover:text-gray-400">Brand01</li>
          <li className="cursor-pointer hover:text-gray-400">Brand02</li>
          <li className="cursor-pointer hover:text-gray-400">Brand03</li>
          <li className="cursor-pointer hover:text-gray-400">Brand04</li>
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <div>Price range here</div>
      </FilterSection>

      <FilterSection title="Color">
      <div className="flex flex-wrap gap-2">
        {colors.map((color, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedColor(color)}
            className={`
              w-6 h-6 rounded-full cursor-pointer
              ${color}
              border
              ${selectedColor === color ? 'border-black' : 'border-gray-300'}
              hover:border-black
              hover:shadow-md
              transition-all
            `}
          />
      ))}
      </div>


      </FilterSection>

      <FilterSection title="Style">
        <ul className="space-y-2">
          <li className="cursor-pointer hover:text-gray-400">Casual</li>
          <li className="cursor-pointer hover:text-gray-400">Vintage</li>
          <li className="cursor-pointer hover:text-gray-400">Street</li>
          <li className="cursor-pointer hover:text-gray-400">Formal</li>
        </ul>
      </FilterSection>

      <FilterSection title="Size">
        <ul className="space-y-2">
          <li className="cursor-pointer hover:text-gray-400">XS</li>
          <li className="cursor-pointer hover:text-gray-400">S</li>
          <li className="cursor-pointer hover:text-gray-400">M</li>
          <li className="cursor-pointer hover:text-gray-400">L</li>
          <li className="cursor-pointer hover:text-gray-400">XL</li>
        </ul>
      </FilterSection>
    </aside>
  )
}
