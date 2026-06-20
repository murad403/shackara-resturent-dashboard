"use client"

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { productSchema, type ProductInput } from '@/validation/product.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetFoodDetailsQuery, useUpdateFoodMutation, useUploadImageMutation } from '@/redux/features/app/app.api'

interface ImageItem {
  id?: string
  url: string
  file?: File
}

function EditProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imagesWithFiles, setImagesWithFiles] = useState<ImageItem[]>([])

  const { data: foodResponse, isLoading: isFetching, error: fetchError } = useGetFoodDetailsQuery(id || '', {
    skip: !id
  })
  const food = foodResponse?.data

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      price: undefined,
      category: '',
      availability: true,
      description: '',
      images: [],
    },
  })

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation()

  // Fetch product data on load
  useEffect(() => {
    if (food) {
      const initialImages = (food.images || []).map(img => ({
        id: img.id,
        url: img.url
      }))
      setImagesWithFiles(initialImages)

      // Pre-fill react hook form values
      reset({
        name: food.name,
        price: Number(food.price),
        category: food.category?.name || '',
        availability: food.isAvailable,
        description: food.description || '',
        images: initialImages.map(img => img.url),
      })
    }
  }, [food, reset])

  const availability = watch('availability')

  const handleUploadBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems: ImageItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const objectUrl = URL.createObjectURL(file)
      newItems.push({ url: objectUrl, file })
    }

    const updatedItems = [...imagesWithFiles, ...newItems]
    setImagesWithFiles(updatedItems)
    setValue('images', updatedItems.map(item => item.url), { shouldValidate: true })
  }

  const handleRemoveImage = (idxToRemove: number) => {
    const updated = imagesWithFiles.filter((_, idx) => idx !== idxToRemove)
    setImagesWithFiles(updated)
    setValue('images', updated.map(item => item.url), { shouldValidate: true })
  }

  const onSubmit = async (data: ProductInput) => {
    if (!id || !food) return
    try {
      const existingImages = imagesWithFiles.filter(img => !img.file)
      const newFiles = imagesWithFiles.filter(img => img.file)

      let newlyUploadedImages: any[] = []

      // 1. Upload files in a single FormData request if there are new ones
      if (newFiles.length > 0) {
        const formData = new FormData()
        newFiles.forEach((item) => {
          if (item.file) {
            formData.append('images', item.file)
          }
        })

        const uploadRes = await uploadImage(formData).unwrap()
        const uploadedData = uploadRes.data
        if (Array.isArray(uploadedData)) {
          newlyUploadedImages = uploadedData
        } else if (uploadedData) {
          newlyUploadedImages = [uploadedData]
        }
      }

      // Merge existing image objects (matched from raw list to preserve metadata) and new uploaded ones
      const finalImages = [
        ...existingImages.map(img => {
          return food.images.find(fi => fi.id === img.id) || img
        }),
        ...newlyUploadedImages
      ]

      if (finalImages.length === 0) {
        alert("At least one product image is required.")
        return
      }

      // 2. Map category string to categoryId and subCategoryId
      const categoryMapping: Record<string, { categoryId: number; subCategoryId: number }> = {
        'Burgers': { categoryId: 2, subCategoryId: 2 },
        'Smoothies & Bowls': { categoryId: 3, subCategoryId: 3 },
        'Wraps & Sandwiches': { categoryId: 4, subCategoryId: 4 },
        'Desserts': { categoryId: 5, subCategoryId: 5 },
        'Breakfast': { categoryId: 6, subCategoryId: 6 },
        'Seafood': { categoryId: 7, subCategoryId: 7 },
        'Beverages': { categoryId: 8, subCategoryId: 8 }
      }

      const categoryInfo = categoryMapping[data.category] || { categoryId: food.categoryId || 2, subCategoryId: food.subCategoryId || 2 }

      // 3. Prepare payload, keeping existing subcomponents safe
      const updatePayload = {
        name: data.name,
        description: data.description,
        price: String(data.price),
        oldPrice: food.oldPrice || "0",
        isAvailable: data.availability,
        categoryId: categoryInfo.categoryId,
        subCategoryId: categoryInfo.subCategoryId,
        images: finalImages,
        quantity: food.quantity || 100,
        calories: food.calories || 350,
        prepTime: food.prepTime || 15,
        hasVariants: food.hasVariants || false,
        hasSides: food.hasSides || false,
        hasExtras: food.hasExtras || false,
        sizeVariants: food.sizeVariants || [],
        sideOptions: food.sideOptions || [],
        itemExtras: food.itemExtras || []
      }

      await updateFood({
        productId: id,
        data: updatePayload
      }).unwrap()

      router.push('/products')
    } catch (err) {
      console.error("Failed to update food product:", err)
      alert("An error occurred while updating the product. Please try again.")
    }
  }

  if (isFetching) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
      </div>
    )
  }

  if (fetchError || !food) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto space-y-4 select-none">
        <h2 className="text-lg font-bold text-title">Product Not Found</h2>
        <p className="text-sm text-subtitle">The product item you are trying to edit does not exist or has been deleted.</p>
        <Link href="/products" passHref>
          <Button className="bg-button-color font-semibold cursor-pointer">Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shadow-xs focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold text-title tracking-tight">
            Edit Product
          </h1>
          <p className="text-xs text-subtitle">
            Update item details
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
                className="bg-white border-gray-200"
                {...register('price')}
              />
              {errors.price && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Product Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-title placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color"
                {...register('category')}
              >
                <option value="">Select category...</option>
                <option value="Burgers">Burgers</option>
                <option value="Smoothies & Bowls">Smoothies & Bowls</option>
                <option value="Wraps & Sandwiches">Wraps & Sandwiches</option>
                <option value="Desserts">Desserts</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Seafood">Seafood</option>
                <option value="Beverages">Beverages</option>
              </select>
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
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative focus:outline-none focus:ring-1 focus:ring-button-color ${availability ? 'bg-button-color' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${availability ? 'translate-x-5' : 'translate-x-0'
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
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-title transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color"
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

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

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

              {imagesWithFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                  {imagesWithFiles.map((item, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden bg-gray-50 group">
                      <img
                        src={item.url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
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
              disabled={isUploading || isUpdating}
              className="w-full sm:w-auto h-11 bg-button-color font-semibold cursor-pointer focus:outline-none disabled:opacity-50"
            >
              {isUploading ? "Uploading Images..." : isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto">
        <p className="text-sm text-subtitle font-medium">Loading form details...</p>
      </div>
    }>
      <EditProductForm />
    </Suspense>
  )
}