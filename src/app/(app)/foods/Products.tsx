"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import ProductCard from './ProductCard'
import DeleteProductModal from '@/components/modal/DeleteProductModal'
import CustomPagination from '@/components/shared/CustomPagination'
import { useGetAllFoodsQuery, useDeleteFoodMutation, useToggleFoodAvailabilityMutation } from '@/redux/features/app/app.api'
import { Food } from '@/redux/features/app/app.type'
import { toast } from 'sonner'

const Products = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [productToDelete, setProductToDelete] = useState<Food | null>(null)

  const itemsPerPage = 12

  // Debounce search input to avoid hitting api on every key stroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // reset to page 1 on new search query
    }, 400)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data: response, isLoading, error } = useGetAllFoodsQuery({
    search: debouncedSearch,
    page: currentPage,
    limit: itemsPerPage
  })
  const [deleteFood] = useDeleteFoodMutation()
  const [toggleFoodAvailability] = useToggleFoodAvailabilityMutation()

  const foods = response?.data || []
  const totalPages = response?.pagination?.totalPages || 1

  // Toggle active/inactive status on backend
  const handleToggleActive = async (id: number | string, currentStatus?: boolean) => {
    try {
      await toggleFoodAvailability(id).unwrap();
      toast.success(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (err: any) {
      console.error("Failed to toggle status:", err)
      toast.error(err?.data?.message || "Failed to update status. Please try again.")
    }
  }

  // Navigate to edit product page
  const handleEdit = (id: number | string) => {
    router.push(`/foods/edit-food?id=${id}`)
  }

  // Open delete confirmation modal
  const handleDeleteTrigger = (id: number | string) => {
    const target = foods.find((f) => f.id === Number(id))
    if (target) {
      setProductToDelete(target)
    }
  }

  // Confirm delete product
  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteFood(productToDelete.id).unwrap()
        toast.success("Product deleted successfully")
        setProductToDelete(null)
      } catch (err: any) {
        console.error("Failed to delete product:", err)
        toast.error(err?.data?.message || "Failed to delete product. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Search Shimmer */}
        <div className="h-11 w-full max-w-full rounded-lg bg-gray-100 animate-pulse" />
        
        {/* Shimmer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white border border-[#E5E7EB] rounded-2xl h-[360px] animate-pulse flex flex-col overflow-hidden">
              <div className="bg-gray-100 h-48 w-full" />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                  </div>
                  <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <div className="h-9 bg-gray-100 rounded flex-1" />
                  <div className="h-9 bg-gray-100 rounded flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 border border-dashed border-red-200 bg-red-50/20 rounded-2xl p-6 select-none max-w-xl mx-auto space-y-3">
        <p className="text-sm text-red-600 font-semibold">Failed to load menu items.</p>
        <p className="text-xs text-red-500 leading-relaxed">
          Please make sure the backend api is running and reachable.
        </p>
      </div>
    )
  }

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

      {/* Products Grid and pagination */}
      {foods.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleActive={handleToggleActive}
                onEdit={handleEdit}
                onDelete={handleDeleteTrigger}
              />
            ))}
          </div>

          {/* Custom Pagination Footer */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
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