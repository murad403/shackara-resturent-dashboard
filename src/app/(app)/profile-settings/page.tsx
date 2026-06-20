"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Store, Mail, Phone, Upload, MapPin } from 'lucide-react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Profile Validation Schema
const profileSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  logoUrl: z.string().min(1, "Logo URL is required").url("Invalid URL format"),
  address: z.string().min(1, "Address is required"),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function ProfileSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [shopProfile, setShopProfile] = useState({
    shopName: 'Tasty Bites Restaurant',
    email: 'tastybites@example.com',
    phone: '+880 1711-123456',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: shopProfile,
  })

  const onSubmit = (data: ProfileInput) => {
    setShopProfile(data)
    setIsEditing(false)
    console.log("Updated profile data saved successfully:", data)
    alert("Profile settings updated (Simulated)")
  }

  const handleCancel = () => {
    reset(shopProfile)
    setIsEditing(false)
  }

  return (
    <DashboardChildrenLayout
      title="Profile Settings"
      subtitle="Manage your restaurant profile and information"
    >
      {/* Main Grid: Left Settings Card, Right Status & Help Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* Left Side Form Container */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Header Section: Avatar Display, Name and Edit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-2">
              <div className="flex items-center gap-4 self-start">
                <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                  <img 
                    src={shopProfile.logoUrl} 
                    alt="Shop Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-title text-base md:text-lg">
                    {shopProfile.shopName}
                  </h3>
                  <p className="text-xs text-subtitle font-semibold">Restaurant Profile</p>
                </div>
              </div>

              {/* Action Buttons toggle */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="h-9 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer focus:outline-none"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="bg-button-color h-9 px-4 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none"
                    >
                      Save Profile
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-button-color h-9 px-4 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shop Name */}
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  type="text"
                  disabled={!isEditing}
                  startIcon={<Store className="w-4 h-4 text-gray-400" />}
                  className="bg-white border-gray-200 disabled:opacity-85 disabled:cursor-not-allowed"
                  {...register('shopName')}
                />
                {errors.shopName && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.shopName.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled={!isEditing}
                  startIcon={<Mail className="w-4 h-4 text-gray-400" />}
                  className="bg-white border-gray-200 disabled:opacity-85 disabled:cursor-not-allowed"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="text"
                  disabled={!isEditing}
                  startIcon={<Phone className="w-4 h-4 text-gray-400" />}
                  className="bg-white border-gray-200 disabled:opacity-85 disabled:cursor-not-allowed"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Shop Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Shop Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="text"
                  disabled={!isEditing}
                  startIcon={<Upload className="w-4 h-4 text-gray-400" />}
                  className="bg-white border-gray-200 disabled:opacity-85 disabled:cursor-not-allowed"
                  {...register('logoUrl')}
                />
                {errors.logoUrl && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.logoUrl.message}
                  </p>
                )}
              </div>

              {/* Address textarea */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative flex items-start w-full">
                  <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    disabled={!isEditing}
                    rows={4}
                    className="flex w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-title transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color disabled:opacity-85 disabled:cursor-not-allowed"
                    {...register('address')}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

            </div>

          </form>
        </div>

        {/* Right Side Info Cards Column */}
        <div className="space-y-6">
          {/* Account Status Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-title border-b border-gray-100 pb-3 mb-4">
              Account Status
            </h3>
            
            <div className="divide-y divide-gray-100">
              <div className="py-3 flex items-center justify-between first:pt-0">
                <span className="text-xs font-semibold text-subtitle/85">Status</span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
                  Active
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-subtitle/85">Member Since</span>
                <span className="text-xs font-bold text-title">Jan 2025</span>
              </div>
              <div className="py-3 flex items-center justify-between last:pb-0">
                <span className="text-xs font-semibold text-subtitle/85">Verified</span>
                <span className="text-xs font-bold text-green-600">Yes</span>
              </div>
            </div>
          </div>

          {/* Need Help Card */}
          <div className="bg-linear-to-br from-button-color to-[#E55F00] text-white rounded-2xl p-6 shadow-md shadow-button-color/10 flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="text-base font-bold tracking-tight">Need Help?</h3>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                Contact support for any questions or issues with your account.
              </p>
            </div>
            
            <button
              type="button"
              className="w-full text-center py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors cursor-pointer focus:outline-none"
            >
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </DashboardChildrenLayout>
  )
}