"use client"

import React, { useState } from 'react'
import AdminSidebar from '@/components/shared/AdminSidebar'
import AdminTopbar from '@/components/shared/AdminTopbar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Panel */}
      <div className="flex flex-col min-w-0 min-h-screen w-full">
        {/* Topbar Panel */}
        <AdminTopbar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setMobileOpen={setMobileOpen}
        />

        {/* Dynamic Page Children */}
        <main className="p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout