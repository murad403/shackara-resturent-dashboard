"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema, type ResetPasswordInput } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordInput) => {
    console.log("Reset password confirmed! Data:", data)
    router.push('/auth/auth-success')
  }

  return (
    <div className="w-full max-w-[460px] mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Icon Header */}
      <div className="flex items-center justify-center mx-auto mb-6">
        <div className="w-[64px] h-[64px] rounded-full bg-button-color flex items-center justify-center text-white shadow-sm">
          <Lock className="w-[28px] h-[28px] stroke-[2.2]" />
        </div>
      </div>

      {/* Header text */}
      <div className="text-center mb-8">
        <h1 className="text-[22px] font-semibold text-title tracking-tight mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-subtitle">
          Enter your new password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="password">New password</Label>
          
          {/* New Password Input */}
          <div className="space-y-1">
            <Input
              id="password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New password"
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Retype password"
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button type="submit">
            Confirm
          </Button>
        </div>
      </form>
    </div>
  )
}