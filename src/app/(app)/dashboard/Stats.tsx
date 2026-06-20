"use client"

import React from 'react'
import { ClipboardList, Clock, Flame, Check, DollarSign, Package } from 'lucide-react'
import StatsCard from './StatsCard'
import { useGetAllFoodsQuery } from '@/redux/features/app/app.api'

const Stats = () => {
  const { data: response, isLoading } = useGetAllFoodsQuery({})
  const foods = response?.data || []

  const activeCount = foods.filter((f) => f.isAvailable).length
  const totalCount = foods.length

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
        value="$0"
        icon={<DollarSign className="w-5 h-5" />}
        iconBgColor="bg-[#9333EA]"
      />

      {/* 6. Active Products */}
      <StatsCard
        title="Active Products"
        value={isLoading ? "Loading..." : `${activeCount}/${totalCount}`}
        icon={<Package className="w-5 h-5" />}
        iconBgColor="bg-[#EC4899]"
      />
    </div>
  )
}

export default Stats