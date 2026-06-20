"use client"

import React, { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPasswordSchema, type ResetPasswordInput } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/redux/features/auth/auth.api'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const otp = searchParams.get('otp') || ''

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

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

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!email || !otp) {
      setErrorMsg('Email or OTP is missing. Cannot reset password.')
      return
    }
    setErrorMsg(null)
    try {
      const response = await resetPassword({
        email,
        otp,
        newPassword: data.password,
      }).unwrap()

      if (response.success) {
        router.push('/auth/auth-success')
      } else {
        setErrorMsg(response.message || 'Failed to reset password')
      }
    } catch (err: any) {
      console.error('Reset password error:', err)
      setErrorMsg(err?.data?.message || 'Failed to reset password. Please try again.')
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
          Reset Password
        </h1>
        <p className="text-sm text-subtitle">
          Enter your new password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {(!email || !otp) && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold leading-normal text-center">
            Credentials parameter is missing. Please restart the forgot password process.
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-semibold leading-normal text-center animate-in fade-in-50 duration-150">
            {errorMsg}
          </div>
        )}

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
          <Button type="submit" disabled={isLoading || !email || !otp}>
            {isLoading ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-sm text-subtitle">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}