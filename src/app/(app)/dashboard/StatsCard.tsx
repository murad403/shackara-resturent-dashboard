import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgColor: string // tailwind class, e.g. bg-blue-500
}

const StatsCard = ({ title, value, icon, iconBgColor }: StatsCardProps) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-lg flex items-center justify-between select-none">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-subtitle/80 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-[26px] font-bold text-title tracking-tight block">
          {value}
        </span>
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${iconBgColor} shadow-sm shrink-0`}>
        {icon}
      </div>
    </div>
  )
}

export default StatsCard