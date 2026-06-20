"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Store,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const AdminSidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  mobileOpen, 
  setMobileOpen 
}: SidebarProps) => {
  const pathname = usePathname()

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: ShoppingBag },
      ]
    },
    {
      title: 'ORDERS',
      items: [
        { name: 'Orders', href: '/orders', icon: ClipboardList },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Profile Settings', href: '/profile-settings', icon: Settings },
      ]
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB] text-gray-600 select-none">
      {/* Sidebar Header Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-[#E5E7EB] shrink-0 px-4",
        isCollapsed && !mobileOpen ? "justify-center" : "justify-between"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && !mobileOpen ? "justify-center w-full" : "overflow-hidden"
        )}>
          <div className="w-8 h-8 rounded-lg bg-button-color flex items-center justify-center text-white shrink-0 shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <span className="font-bold text-title text-base tracking-tight whitespace-nowrap">
              Vendor Portal
            </span>
          )}
        </div>

        {/* Mobile Close X Button (Only rendered in mobile drawer mode) */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {(!isCollapsed || mobileOpen) && (
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase px-3 block mb-2">
                {group.title}
              </span>
            )}
            
            <div className="space-y-1">
              {group.items.map((item, iIdx) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    onClick={() => mobileOpen && setMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-lg text-sm transition-all relative group w-full h-11",
                      isCollapsed && !mobileOpen 
                        ? "justify-center px-0 gap-0" 
                        : "justify-start px-3 py-2.5 gap-3",
                      active 
                        ? "bg-button-color text-white shadow-sm font-semibold" 
                        : "hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-gray-400 group-hover:text-gray-600")} />
                    {(!isCollapsed || mobileOpen) ? (
                      <span className="whitespace-nowrap transition-opacity duration-200">
                        {item.name}
                      </span>
                    ) : (
                      /* Tooltip on collapsed desktop view */
                      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer (Logout) */}
      <div className="p-3 border-t border-[#E5E7EB] shrink-0">
        <Link
          href="/auth/sign-in"
          onClick={() => mobileOpen && setMobileOpen(false)}
          className={cn(
            "flex items-center rounded-lg text-sm transition-all relative group w-full h-11",
            isCollapsed && !mobileOpen 
              ? "justify-center px-0 gap-0" 
              : "justify-start px-3 py-2.5 gap-3",
            "hover:bg-red-50 text-gray-500 hover:text-red-600"
          )}
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 shrink-0" />
          {(!isCollapsed || mobileOpen) ? (
            <span className="font-medium whitespace-nowrap">Logout</span>
          ) : (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
              Logout
            </div>
          )}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Permanent, collapsible) */}
      <aside className={cn(
        "hidden md:block h-screen top-0 shrink-0 transition-all duration-300 z-30 sticky",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {sidebarContent}

        {/* Absolute-positioned Collapse Button floating on the right border line */}
        {!mobileOpen && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute top-5 -right-3 w-6 h-6 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-button-color z-50"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content Wrapper */}
      <aside className={cn(
        "md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 transition-all duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default AdminSidebar