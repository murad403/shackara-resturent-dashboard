"use client"

import React from 'react'
import Link from 'next/link'
import { Bell, Settings, LogOut, Menu } from 'lucide-react'

interface TopbarProps {
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (c: boolean) => void
  setMobileOpen: (open: boolean) => void
}

const AdminTopbar = ({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  setMobileOpen 
}: TopbarProps) => {
  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none">
      {/* Left side: Hamburger (Mobile) + Welcome (Desktop) */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer focus:outline-none"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-base font-bold text-title tracking-tight leading-tight">
            Tasty Bites Restaurant
          </h2>
          <p className="text-xs text-subtitle mt-0.5 font-medium">
            Welcome back to your dashboard
          </p>
        </div>
      </div>

      {/* Right side: Quick stats, notifications, avatar, logout */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-50 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none">
          <Bell className="w-[19px] h-[19px]" />
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full" />
        </button>

        {/* Settings Button */}
        <button className="p-2 rounded-full hover:bg-gray-50 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none">
          <Settings className="w-[19px] h-[19px]" />
        </button>

        {/* Divider line */}
        <span className="h-6 w-px bg-gray-200" />

        {/* User Info Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
            {/* Standard high quality avatar image */}
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Restaurant Owner Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Logout Button */}
          <Link
            href="/auth/sign-in"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar