"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import ProductCard from './ProductCard'
import DeleteProductModal from '@/components/modal/DeleteProductModal'
import { getProducts, saveProducts, Product } from '@/lib/productsStore'

const Products = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const loadProducts = () => {
    setProducts(getProducts())
  }

  useEffect(() => {
    loadProducts()
    window.addEventListener('products-updated', loadProducts)
    return () => {
      window.removeEventListener('products-updated', loadProducts)
    }
  }, [])

  // Toggle active/inactive status
  const handleToggleActive = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, isActive: !p.isActive }
      }
      return p
    })
    setProducts(updated)
    saveProducts(updated)
  }

  // Navigate to edit product page
  const handleEdit = (id: string) => {
    router.push(`/products/edit-product?id=${id}`)
  }

  // Open delete confirmation modal
  const handleDeleteTrigger = (id: string) => {
    const target = products.find((p) => p.id === id)
    if (target) {
      setProductToDelete(target)
    }
  }

  // Confirm delete product
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      const updated = products.filter((p) => p.id !== productToDelete.id)
      setProducts(updated)
      saveProducts(updated)
      setProductToDelete(null)
    }
  }

  // Filter products by search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full max-w-full">
        <div className="absolute left-4 text-gray-400 pointer-events-none flex items-center justify-center">
          <Search className="w-4.5 h-4.5" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm text-title shadow-xs transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleActive={handleToggleActive}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-200 bg-white rounded-2xl p-6">
          <p className="text-sm text-subtitle font-medium">No products found matching your search.</p>
        </div>
      )}

      {/* Delete Product Modal Popup */}
      {productToDelete && (
        <DeleteProductModal
          isOpen={!!productToDelete}
          productName={productToDelete.name}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}

export default Products