"use client"

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Image as ImageIcon, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { productSchema, type ProductInput } from '@/validation/product.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProducts, saveProducts, Product } from '@/lib/productsStore'

export default function AddProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Local state for tracking uploaded image URLs/Object URLs
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: undefined,
      category: '',
      availability: true,
      description: '',
      images: [],
    },
  })

  // Watch fields for custom styling or states
  const availability = watch('availability')
  const images = watch('images')

  // Trigger file dialog
  const handleUploadBoxClick = () => {
    fileInputRef.current?.click()
  }

  // Handle image files selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPreviews: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Create local URL for preview
      const objectUrl = URL.createObjectURL(file)
      newPreviews.push(objectUrl)
    }

    const updatedPreviews = [...imagePreviews, ...newPreviews]
    setImagePreviews(updatedPreviews)
    setValue('images', updatedPreviews, { shouldValidate: true })
  }

  // Remove individual preview image
  const handleRemoveImage = (idxToRemove: number) => {
    const updated = imagePreviews.filter((_, idx) => idx !== idxToRemove)
    setImagePreviews(updated)
    setValue('images', updated, { shouldValidate: true })
  }

  // Form submission handler
  const onSubmit = (data: ProductInput) => {
    const currentProducts = getProducts()
    
    // Create new unique product ID
    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name,
      price: data.price,
      category: data.category,
      description: data.description,
      isActive: data.availability,
      images: data.images,
    }

    const updatedProducts = [...currentProducts, newProduct]
    saveProducts(updatedProducts)
    router.push('/products')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header with back navigation button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/products" 
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shadow-xs focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold text-title tracking-tight">
            Add New Product
          </h1>
          <p className="text-xs text-subtitle">
            Add a new item to your menu
          </p>
        </div>
      </div>

      {/* Main card box container */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Product Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Chicken Burger"
                className="bg-white border-gray-200"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Product Price Input */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (BDT) *</Label>
              <Input
                id="price"
                type="text"
                placeholder="350"
                className="bg-white border-gray-200"
                {...register('price')}
              />
              {errors.price && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Product Category Input */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                type="text"
                placeholder="e.g. Burgers, Pizza, Pasta"
                className="bg-white border-gray-200"
                {...register('category')}
              />
              {errors.category && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Availability Toggle Field */}
            <div className="space-y-2 flex flex-col justify-end pb-1 select-none">
              <Label>Availability</Label>
              <div className="flex items-center gap-3 h-11">
                <button
                  type="button"
                  onClick={() => setValue('availability', !availability)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative focus:outline-none focus:ring-1 focus:ring-button-color ${
                    availability ? 'bg-button-color' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      availability ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-subtitle/90">
                  Product is available for order
                </span>
              </div>
            </div>

            {/* Product Description Input */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                placeholder="Describe your product..."
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0A0A0A] transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Multiple Product Images Upload area */}
            <div className="col-span-1 md:col-span-2 space-y-2.5">
              <Label>Product Image*</Label>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Upload Dashed Container Box */}
              <div 
                onClick={handleUploadBoxClick}
                className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-button-color transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer text-center select-none"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-title">Click to upload product image</p>
                  <p className="text-xs text-gray-400">Supports selecting multiple files</p>
                </div>
              </div>

              {/* Thumbnails list */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden bg-gray-50 group">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Delete cross hover button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-colors focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>

          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
            <Link href="/products" passHref className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto h-11 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-semibold cursor-pointer focus:outline-none"
              >
                Cancel
              </Button>
            </Link>
            
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 bg-button-color font-semibold cursor-pointer focus:outline-none"
            >
              Add Product
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}