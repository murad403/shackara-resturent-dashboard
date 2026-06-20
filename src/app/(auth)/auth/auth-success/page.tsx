"use client"
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AuthSuccessPage() {
  const router = useRouter()

  const handleSignInClick = () => {
    router.push('/auth/sign-in')
  }

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Success Checkmark Header */}
      <div className="flex items-center justify-center mx-auto mb-6">
        <div className="w-[64px] h-[64px] rounded-full bg-[#16A34A] flex items-center justify-center text-white shadow-sm">
          <Check className="w-[32px] h-[32px] stroke-3" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-[22px] font-bold text-title tracking-tight leading-snug mb-2">
          Your Password<br />Successfully Changed
        </h1>
        <p className="text-xs text-subtitle">
          Sign in to your account with your new password
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button onClick={handleSignInClick}>
          Sign In
        </Button>
      </div>
    </div>
  )
}