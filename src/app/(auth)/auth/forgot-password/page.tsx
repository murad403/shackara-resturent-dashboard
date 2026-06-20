"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordInput) => {
    console.log("Forgot Password success! Data:", data)
    // Go to OTP verification
    router.push('/auth/verify-otp')
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
          Forgot Password
        </h1>
        <p className="text-sm text-subtitle">
          Type your email to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            startIcon={<Mail className="w-4 h-4 text-gray-400" />}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button type="submit">
            Send OTP
          </Button>
        </div>
      </form>
    </div>
  )
}