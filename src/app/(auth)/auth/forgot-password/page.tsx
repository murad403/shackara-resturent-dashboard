"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPasswordMutation } from '@/redux/features/auth/auth.api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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

  const onSubmit = async (data: ForgotPasswordInput) => {
    setErrorMsg(null)
    try {
      const response = await forgotPassword({ email: data.email }).unwrap()
      if (response.success) {
        // Go to OTP verification with email query parameter
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`)
      } else {
        setErrorMsg(response.message || 'Something went wrong')
      }
    } catch (err: any) {
      console.error('Forgot password error:', err)
      setErrorMsg(err?.data?.message || 'Failed to send OTP. Please try again.')
    }
  }

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
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
        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-semibold leading-normal animate-in fade-in-50 duration-150">
            {errorMsg}
          </div>
        )}

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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </Button>
        </div>
      </form>
    </div>
  )
}