"use client"

import React, { useState, useEffect } from 'react'
import { ClipboardList, Clock, Flame, Check, DollarSign, Package } from 'lucide-react'
import StatsCard from './StatsCard'
import { getProducts } from '@/lib/productsStore'

const Stats = () => {
  const [productStats, setProductStats] = useState({ active: 3, total: 4 })

  const updateStats = () => {
    const products = getProducts()
    const active = products.filter((p) => p.isActive).length
    const total = products.length
    setProductStats({ active, total })
  }

  useEffect(() => {
    updateStats()
    window.addEventListener('products-updated', updateStats)
    return () => {
      window.removeEventListener('products-updated', updateStats)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Total Orders */}
      <StatsCard
        title="Total Orders"
        value={3}
        icon={<ClipboardList className="w-5 h-5" />}
        iconBgColor="bg-blue-500"
      />

      {/* 2. Pending Orders */}
      <StatsCard
        title="Pending Orders"
        value={1}
        icon={<Clock className="w-5 h-5" />}
        iconBgColor="bg-[#D97706]"
      />

      {/* 3. Cooking */}
      <StatsCard
        title="Cooking"
        value={1}
        icon={<Flame className="w-5 h-5" />}
        iconBgColor="bg-[#EA580C]"
      />

      {/* 4. Completed */}
      <StatsCard
        title="Completed"
        value={0}
        icon={<Check className="w-5.5 h-5.5 stroke-[2.5]" />}
        iconBgColor="bg-[#16A34A]"
      />

      {/* 5. Total Earnings */}
      <StatsCard
        title="Total Earnings"
        value="৳0"
        icon={<DollarSign className="w-5 h-5" />}
        iconBgColor="bg-[#9333EA]"
      />

      {/* 6. Active Products */}
      <StatsCard
        title="Active Products"
        value={`${productStats.active}/${productStats.total}`}
        icon={<Package className="w-5 h-5" />}
        iconBgColor="bg-[#EC4899]"
      />
    </div>
  )
}

export default Stats