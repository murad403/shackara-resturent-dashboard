import React from 'react'
import { Power, Edit3, Trash2 } from 'lucide-react'
import { Food } from '@/redux/features/app/app.type'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Food
  onToggleActive: (id: number | string, currentStatus: boolean) => void
  onEdit: (id: number | string) => void
  onDelete: (id: number | string) => void
}

const ProductCard = ({ product, onToggleActive, onEdit, onDelete }: ProductCardProps) => {
  // Use first image if available, else a fallback mockup image
  const displayImage = product.images && product.images.length > 0
    ? product.images[0].url
    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'

  // Helper to remove any HTML tags from backend description for card preview
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '')
    : ''

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all flex flex-col group select-none">
      {/* Product Image and Floating Power Toggle */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 shrink-0">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* Active status indicator (floating power icon) */}
        <button
          type="button"
          onClick={() => onToggleActive(product.id, product.isAvailable)}
          className={cn(
            "absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 focus:outline-none",
            product.isAvailable
              ? "bg-[#16A34A] hover:bg-[#15803d]"
              : "bg-gray-500/80 backdrop-blur-xs hover:bg-gray-600"
          )}
          title={product.isAvailable ? "Deactivate product" : "Activate product"}
        >
          <Power className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Card Information body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4.5">
        <div className="space-y-2">
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-title text-base leading-snug truncate" title={product.name}>
              {product.name}
            </h4>
            <span className="font-bold text-button-color text-base shrink-0">
              ৳{product.price}
            </span>
          </div>

          {/* Category Tag */}
          <span className="inline-block text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {product.category?.name || 'Uncategorized'}
          </span>

          {/* Description */}
          <p className="text-xs text-subtitle line-clamp-2 leading-relaxed min-h-[34px]" title={cleanDescription}>
            {cleanDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1 w-full">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(product.id)}
            className="flex-1 h-9 rounded-lg border border-blue-100 bg-blue-50/40 hover:bg-blue-50 text-blue-600 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="flex-1 h-9 rounded-lg border border-red-100 bg-red-50/40 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard