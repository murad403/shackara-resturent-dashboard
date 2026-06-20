"use client"
import React, { useState, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { productSchema, type ProductInput } from '@/validation/product.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAddFoodMutation, useUploadImageMutation } from '@/redux/features/app/app.api'
import { toast } from 'sonner'

interface ImageItem {
  preview: string
  file?: File
}

export default function AddProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [imagesWithFiles, setImagesWithFiles] = useState<ImageItem[]>([])

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      price: undefined,
      oldPrice: undefined,
      category: '',
      subCategory: '',
      availability: true,
      quantity: 100,
      calories: undefined,
      prepTime: undefined,
      description: '',
      images: [],
      sizeVariants: [],
      sideOptions: [],
      itemExtras: [],
    },
  })

  // Hook Form Dynamic lists
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: "sizeVariants"
  })

  const { fields: sideFields, append: appendSide, remove: removeSide, update: updateSide } = useFieldArray({
    control,
    name: "sideOptions"
  })

  const { fields: extraFields, append: appendExtra, remove: removeExtra } = useFieldArray({
    control,
    name: "itemExtras"
  })

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const [addFood, { isLoading: isAdding }] = useAddFoodMutation()

  const availability = watch('availability')

  // Handle exclusive default check for side options
  const handleSetDefaultSide = (index: number) => {
    sideFields.forEach((_, i) => {
      const currentVal = watch(`sideOptions.${i}`)
      updateSide(i, {
        ...currentVal,
        isDefault: i === index
      })
    })
  }

  // Trigger file dialog
  const handleUploadBoxClick = () => {
    fileInputRef.current?.click()
  }

  // Handle image files selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems: ImageItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const objectUrl = URL.createObjectURL(file)
      newItems.push({ preview: objectUrl, file })
    }

    const updatedItems = [...imagesWithFiles, ...newItems]
    setImagesWithFiles(updatedItems)
    setValue('images', updatedItems.map(item => item.preview), { shouldValidate: true })
  }

  // Remove individual preview image
  const handleRemoveImage = (idxToRemove: number) => {
    const updated = imagesWithFiles.filter((_, idx) => idx !== idxToRemove)
    setImagesWithFiles(updated)
    setValue('images', updated.map(item => item.preview), { shouldValidate: true })
  }

  // Form submission handler
  const onSubmit = async (data: ProductInput) => {
    try {
      let uploadedImages: any[] = []

      // 1. Upload files in a single FormData request
      if (imagesWithFiles.length > 0) {
        const formData = new FormData()
        imagesWithFiles.forEach((item) => {
          if (item.file) {
            formData.append('images', item.file)
          }
        })

        const uploadRes = await uploadImage(formData).unwrap()
        const uploadedData = uploadRes.data
        if (Array.isArray(uploadedData)) {
          uploadedImages = uploadedData
        } else if (uploadedData) {
          uploadedImages = [uploadedData]
        }
      }

      const imageIds = uploadedImages.map(img => img.id)

      if (imageIds.length === 0) {
        toast.error("At least one product image is required.")
        return
      }

      // 2. Prepare payload matching CreateFoodSchema
      const foodPayload = {
        name: data.name,
        description: `<p>${data.description}</p>`,
        images: imageIds, // UUID strings
        price: Number(data.price),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
        isAvailable: data.availability,
        quantity: Number(data.quantity),
        calories: data.calories ? Number(data.calories) : undefined,
        prepTime: data.prepTime ? Number(data.prepTime) : undefined,
        category: data.category,
        subCategory: data.subCategory || undefined,
        sizeVariants: data.sizeVariants || [],
        sideOptions: data.sideOptions || [],
        itemExtras: data.itemExtras || []
      }

      await addFood(foodPayload).unwrap()
      toast.success("Food created successfully")
      router.push('/products')
    } catch (err: any) {
      console.error("Failed to add food product:", err)
      toast.error(err?.data?.message || "An error occurred while creating the product. Please try again.")
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 select-none">
      {/* Header with back navigation button */}
      <div className="flex items-center gap-4">
        <Link
          href="/foods"
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shadow-xs focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold text-title tracking-tight">
            Add New Food
          </h1>
          <p className="text-xs text-subtitle">
            Add a new item to your menu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Product Info Section */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-6">
          <h3 className="text-base font-bold text-title border-b border-gray-100 pb-3">Core Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
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

            {/* Sub Category */}
            <div className="space-y-2">
              <Label htmlFor="subCategory">Subcategory (Optional)</Label>
              <Input
                id="subCategory"
                type="text"
                placeholder="e.g. Chicken Burgers"
                className="bg-white border-gray-200"
                {...register('subCategory')}
              />
              {errors.subCategory && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.subCategory.message}
                </p>
              )}
            </div>

            {/* Product Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
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

            {/* Old Price */}
            <div className="space-y-2">
              <Label htmlFor="oldPrice">Old Price (Optional)</Label>
              <Input
                id="oldPrice"
                type="text"
                placeholder="400"
                className="bg-white border-gray-200"
                {...register('oldPrice')}
              />
              {errors.oldPrice && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.oldPrice.message}
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Quantity *</Label>
              <Input
                id="quantity"
                type="text"
                placeholder="100"
                className="bg-white border-gray-200"
                {...register('quantity')}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            {/* Availability Toggle Field */}
            <div className="space-y-2 flex flex-col justify-end pb-1">
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
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              placeholder="Describe your product..."
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
        </div>

        {/* Nutritional & Prep Details */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-6">
          <h3 className="text-base font-bold text-title border-b border-gray-100 pb-3">Nutritional & Prep Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calories */}
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (Optional)</Label>
              <Input
                id="calories"
                type="text"
                placeholder="e.g. 350"
                className="bg-white border-gray-200"
                {...register('calories')}
              />
              {errors.calories && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.calories.message}
                </p>
              )}
            </div>

            {/* Prep Time */}
            <div className="space-y-2">
              <Label htmlFor="prepTime">Preparation Time (Minutes, Optional)</Label>
              <Input
                id="prepTime"
                type="text"
                placeholder="e.g. 15"
                className="bg-white border-gray-200"
                {...register('prepTime')}
              />
              {errors.prepTime && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.prepTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Multiple Product Images Upload area */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4">
          <h3 className="text-base font-bold text-title border-b border-gray-100 pb-3">Product Images</h3>

          <div className="space-y-2.5">
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
            {imagesWithFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                {imagesWithFiles.map((item, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden bg-gray-50 group">
                    <img
                      src={item.preview}
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

        {/* Size Variants Dynamic Section */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-title">Size Variants</h3>
            <Button
              type="button"
              onClick={() => appendSize({ size: 'MEDIUM', price: 0 })}
              className="bg-button-color text-xs h-8 px-3 flex items-center gap-1.5 w-auto font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Size</span>
            </Button>
          </div>

          {sizeFields.length > 0 ? (
            <div className="space-y-4">
              {sizeFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Size *</Label>
                      <select
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-title focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color"
                        {...register(`sizeVariants.${idx}.size`)}
                      >
                        <option value="SMALL">SMALL</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LARGE">LARGE</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Variant Price *</Label>
                      <Input
                        type="text"
                        placeholder="0"
                        className="bg-white border-gray-200 h-10"
                        {...register(`sizeVariants.${idx}.price`)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSize(idx)}
                    className="mt-6 w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer focus:outline-none self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-subtitle">No size variants added. Standard price will be used.</p>
            </div>
          )}
        </div>

        {/* Side Options Dynamic Section */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-title">Side Options</h3>
            <Button
              type="button"
              onClick={() => appendSide({ name: '', price: 0, isDefault: false })}
              className="bg-button-color text-xs  w-auto h-8 px-3 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Side Option</span>
            </Button>
          </div>

          {sideFields.length > 0 ? (
            <div className="space-y-4">
              {sideFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Side Name *</Label>
                      <Input
                        type="text"
                        placeholder="e.g. French Fries"
                        className="bg-white border-gray-200 h-10"
                        {...register(`sideOptions.${idx}.name`)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Side Price *</Label>
                      <Input
                        type="text"
                        placeholder="0"
                        className="bg-white border-gray-200 h-10"
                        {...register(`sideOptions.${idx}.price`)}
                      />
                    </div>

                    {/* Default side option switch */}
                    <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                      <Label className="text-xs">Default Side</Label>
                      <div className="flex items-center gap-2 h-10 select-none">
                        <button
                          type="button"
                          onClick={() => handleSetDefaultSide(idx)}
                          className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative focus:outline-none focus:ring-1 focus:ring-button-color ${watch(`sideOptions.${idx}.isDefault`) ? 'bg-button-color' : 'bg-gray-200'
                            }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${watch(`sideOptions.${idx}.isDefault`) ? 'translate-x-4' : 'translate-x-0'
                              }`}
                          />
                        </button>
                        <span className="text-xs text-subtitle">Set as default</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSide(idx)}
                    className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer focus:outline-none self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-subtitle">No side options added yet.</p>
            </div>
          )}
        </div>

        {/* Item Extras Dynamic Section */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-title">Extra Add-ons</h3>
            <Button
              type="button"
              onClick={() => appendExtra({ name: '', price: 0 })}
              className="bg-button-color w-auto text-xs h-8 px-3 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Extra Item</span>
            </Button>
          </div>

          {extraFields.length > 0 ? (
            <div className="space-y-4">
              {extraFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Extra Name *</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Extra Cheese"
                        className="bg-white border-gray-200 h-10"
                        {...register(`itemExtras.${idx}.name`)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Extra Price *</Label>
                      <Input
                        type="text"
                        placeholder="0"
                        className="bg-white border-gray-200 h-10"
                        {...register(`itemExtras.${idx}.price`)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeExtra(idx)}
                    className="mt-6 w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer focus:outline-none self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-subtitle">No extra add-ons added yet.</p>
            </div>
          )}
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
            disabled={isUploading || isAdding}
            className="w-full sm:w-auto h-11 bg-button-color font-semibold cursor-pointer focus:outline-none disabled:opacity-50"
          >
            {isUploading ? "Uploading Images..." : isAdding ? "Adding Product..." : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}