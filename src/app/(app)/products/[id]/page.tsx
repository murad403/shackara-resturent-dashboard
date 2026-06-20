"use client"

import React, { useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Flame, ShieldAlert, Image as ImageIcon, CheckCircle, Package } from 'lucide-react'
import { useGetFoodDetailsQuery } from '@/redux/features/app/app.api'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ProductDetailsPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const id = resolvedParams.id

    const { data: response, isLoading, error } = useGetFoodDetailsQuery(id)
    const food = response?.data

    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Loading skeleton screen
    if (isLoading) {
        return (
            <DashboardChildrenLayout
                title="Product Details"
                subtitle="Loading item information..."
            >
                <div className="space-y-6 max-w-6xl mx-auto pb-10">
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mb-4" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none">
                        {/* Left Column Skeleton */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-sm">
                                <div className="aspect-video w-full bg-gray-100 rounded-xl animate-pulse" />
                                <div className="flex gap-3 pt-2">
                                    {[1, 2, 3].map(n => (
                                        <div key={n} className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                                <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                                    <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column Skeleton */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-sm">
                                <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
                                <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse" />
                                <div className="space-y-3 pt-4">
                                    <div className="h-12 bg-gray-50 rounded animate-pulse" />
                                    <div className="h-12 bg-gray-50 rounded animate-pulse" />
                                    <div className="h-12 bg-gray-50 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardChildrenLayout>
        )
    }

    // Error screen
    if (error || !food) {
        return (
            <DashboardChildrenLayout
                title="Product Details"
                subtitle="Error loading product"
            >
                <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-title">Product Not Found</h2>
                    <p className="text-sm text-subtitle">The product item you are trying to view does not exist or has been deleted.</p>
                    <Link href="/products" passHref>
                        <button className="bg-button-color text-white h-10 px-6 rounded-lg text-sm font-semibold cursor-pointer active:scale-95 transition-transform focus:outline-none">
                            Back to Products
                        </button>
                    </Link>
                </div>
            </DashboardChildrenLayout>
        )
    }

    const images = food.images || []
    const currentImage = images[activeImageIndex]?.url || null

    return (

        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            {/* Navigation row */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2 select-none">
                <div className='flex items-center gap-2'>
                    <Link
                        href="/products"
                        className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shadow-xs focus:outline-none shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h3 className="text-lg font-bold text-title">{food?.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/products/edit-product?id=${food.id}`} passHref>
                        <button className="h-9 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer focus:outline-none">
                            Edit Details
                        </button>
                    </Link>
                </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Media & Core Description */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Image Preview Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col items-center">
                        <div className="relative aspect-video w-full overflow-hidden bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-1.5 select-none">
                                    <ImageIcon className="w-12 h-12 stroke-[1.5] text-gray-300" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">No Image Available</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails grid */}
                        {images.length > 1 && (
                            <div className="flex flex-wrap gap-3 pt-1 self-start select-none">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-16 h-16 rounded-lg border overflow-hidden transition-all focus:outline-none ${activeImageIndex === idx
                                            ? 'border-button-color ring-2 ring-button-color/10 scale-102 shadow-xs'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                        <h3 className="text-base font-bold text-title border-b border-gray-100 pb-3 select-none">Product Description</h3>
                        <div
                            className="text-sm text-subtitle leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: food.description || '<p>No description provided.</p>' }}
                        />
                    </div>

                    {/* Nutritional & Prep Stats */}
                    <div className="grid grid-cols-2 gap-4 select-none">
                        {/* Calories Card */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <Flame className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Calories</p>
                                <p className="text-sm font-bold text-title">{food.calories ? `${food.calories} kcal` : 'N/A'}</p>
                            </div>
                        </div>

                        {/* Prep Time Card */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prep Time</p>
                                <p className="text-sm font-bold text-title">{food.prepTime ? `${food.prepTime} mins` : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Pricing details, Stock levels, variants & sideOptions */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Purchase & Stock Summary */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-5">
                        <div>
                            <h2 className="text-2xl font-bold text-title leading-tight">{food.name}</h2>
                            <div className="flex items-center gap-3 mt-2 select-none">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${food.isAvailable
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                    {food.isAvailable ? 'Available' : 'Out of Stock'}
                                </span>

                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    {food.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-b border-gray-100 py-4 flex items-baseline justify-between select-none">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                    <span className="text-3xl font-extrabold text-button-color">${food.price}</span>
                                    {food.oldPrice && Number(food.oldPrice) > Number(food.price) && (
                                        <span className="text-sm text-gray-400 line-through">${food.oldPrice}</span>
                                    )}
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-end gap-1">
                                    <Package className="w-3.5 h-3.5" />
                                    <span>In Stock</span>
                                </p>
                                <p className="text-lg font-extrabold text-title mt-0.5">{food.quantity} items</p>
                            </div>
                        </div>
                    </div>

                    {/* Size Variants Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-title border-b border-gray-100 pb-2.5 select-none">Size Variants</h3>
                        {food.sizeVariants && food.sizeVariants.length > 0 ? (
                            <div className="divide-y divide-gray-100 select-none">
                                {food.sizeVariants.map((variant, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                        <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 uppercase">
                                            {variant.size}
                                        </span>
                                        <span className="text-sm font-extrabold text-title">${variant.price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-subtitle italic">No size variants added.</p>
                        )}
                    </div>

                    {/* Side Options Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-title border-b border-gray-100 pb-2.5 select-none">Side Options</h3>
                        {food.sideOptions && food.sideOptions.length > 0 ? (
                            <div className="divide-y divide-gray-100 select-none">
                                {food.sideOptions.map((side, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-title">{side.name}</span>
                                            {side.isDefault && (
                                                <span className="text-[9px] font-bold text-white bg-button-color/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                    <CheckCircle className="w-2.5 h-2.5 fill-white text-button-color" />
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-extrabold text-gray-500">${side.price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-subtitle italic">No side options available.</p>
                        )}
                    </div>

                    {/* Item Extras Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-title border-b border-gray-100 pb-2.5 select-none">Extra Add-ons</h3>
                        {food.itemExtras && food.itemExtras.length > 0 ? (
                            <div className="divide-y divide-gray-100 select-none">
                                {food.itemExtras.map((extra, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                        <span className="text-xs font-semibold text-title">{extra.name}</span>
                                        <span className="text-sm font-extrabold text-gray-500">+${extra.price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-subtitle italic">No extra add-ons available.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>

    )
}