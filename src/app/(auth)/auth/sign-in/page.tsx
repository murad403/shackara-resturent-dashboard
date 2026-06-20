"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginSchema, type LoginInput } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useSignInMutation } from '@/redux/features/auth/auth.api'
import { saveToken } from '@/lib/auth'

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [signIn, { isLoading }] = useSignInMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'mdmurad.dev2004@gmail.com',
      password: '12345678',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null)
    try {
      const response = await signIn(data).unwrap()
      if (response.success) {
        const { accessToken, refreshToken } = response.data.tokens
        await saveToken(accessToken, refreshToken)
        router.push('/')
      } else {
        setErrorMsg(response.message || 'Login failed')
      }
    } catch (err: any) {
      console.error('Sign-in error:', err)
      setErrorMsg(err?.data?.message || 'Login failed. Please check your credentials.')
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
          Resturent Login
        </h1>
        <p className="text-sm text-subtitle">
          Sign in to access the dashboard
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

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            startIcon={<Lock className="w-4 h-4 text-gray-400" />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
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

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-1">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-button-color hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  )
}