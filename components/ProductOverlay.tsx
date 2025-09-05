'use client'

import { ProductPlacement } from '@/types'
import { ShoppingBag } from 'lucide-react'

interface ProductOverlayProps {
  placement: ProductPlacement
  onClick: () => void
}

export default function ProductOverlay({ placement, onClick }: ProductOverlayProps) {
  const { product, x, y, width, height } = placement

  return (
    <div
      className="product-overlay"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      onClick={onClick}
    >
      {/* Clickable area overlay */}
      <div className="absolute inset-0 bg-primary-500 bg-opacity-20 rounded-lg border-2 border-primary-500 hover:bg-opacity-30 transition-all">
        {/* Product icon */}
        <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-1">
          <ShoppingBag className="h-4 w-4" />
        </div>
        
        {/* Price tag */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-2 py-1 text-xs font-semibold text-gray-900 shadow-lg">
          {product.price}
        </div>
      </div>
      
      {/* Tooltip on hover */}
      <div className="product-tooltip opacity-0 hover:opacity-100 transition-opacity -top-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="flex items-center space-x-2">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <p className="font-medium text-sm">{product.title}</p>
            <p className="text-primary-600 font-semibold">{product.price}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
