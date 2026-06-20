"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { verifyOtpSchema, type VerifyOtpInput } from '@/validation/auth.validation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function VerifyOtpPage() {
  const router = useRouter()
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(59)
  
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  })

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // OTP values update & React Hook Form synch
  const updateOtpValue = (newValues: string[]) => {
    setOtpValues(newValues)
    const otpString = newValues.join('')
    setValue('otp', otpString, { shouldValidate: true })
  }

  // Handle Input Changes
  const handleChange = (index: number, val: string) => {
    const numericVal = val.replace(/\D/g, '') // only digits
    if (!numericVal) {
      const updated = [...otpValues]
      updated[index] = ''
      updateOtpValue(updated)
      return
    }

    const lastChar = numericVal[numericVal.length - 1]
    const updated = [...otpValues]
    updated[index] = lastChar
    updateOtpValue(updated)

    // Focus next input if not the last one
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle Key Down (Backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const updated = [...otpValues]
        updated[index - 1] = ''
        updateOtpValue(updated)
        inputRefs.current[index - 1]?.focus()
      } else {
        const updated = [...otpValues]
        updated[index] = ''
        updateOtpValue(updated)
      }
    }
  }

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split('')
      updateOtpValue(newOtpValues)
      inputRefs.current[5]?.focus()
    }
  }

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(59)
      console.log("OTP Resent (Simulated)")
    }
  }

  const onSubmit = (data: VerifyOtpInput) => {
    console.log("OTP verified successfully! Code:", data.otp)
    router.push('/auth/reset-password')
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
          Verify Email
        </h1>
        <p className="text-sm text-subtitle">
          Type the OTP to reset your password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OTP digit inputs */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center gap-3.5 w-full">
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-12 h-12 md:w-14 md:h-14 border border-gray-200 rounded-lg text-center text-lg font-semibold text-title bg-white shadow-sm transition-all focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-xs text-red-500 font-medium mt-3 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit">
          Verify
        </Button>

        {/* Resend Link and Timer */}
        <div className="text-center text-xs text-[#6B7280]">
          Don't get the code?{' '}
          {timeLeft > 0 ? (
            <span className="font-semibold text-button-color">
              Resend ({timeLeft}s)
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-button-color hover:underline focus:outline-none"
            >
              Resend
            </button>
          )}
        </div>
      </form>
    </div>
  )
}