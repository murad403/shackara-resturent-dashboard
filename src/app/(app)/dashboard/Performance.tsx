import React from 'react'
import { TrendingUp } from 'lucide-react'

const Performance = () => {
  return (
    <div className="bg-linear-to-br from-button-color to-[#E55F00] text-white rounded-2xl p-6 shadow-md shadow-button-color/10 select-none flex flex-col justify-between min-h-[200px]">
      <div className="space-y-2">
        {/* Header Icon + Title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5.5 h-5.5 stroke-[2.2]" />
          <h3 className="text-lg font-bold tracking-tight">Performance</h3>
        </div>
        
        {/* Description text */}
        <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">
          Your restaurant is performing well! Keep up the great work.
        </p>
      </div>

      {/* Internal translucent subcard */}
      <div className="mt-5 bg-white/10 border border-white/10 rounded-xl p-4.5 backdrop-blur-xs flex flex-col gap-1">
        <span className="text-[10px] md:text-xs font-bold tracking-wider text-white/80 uppercase">
          Monthly Growth
        </span>
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
          +23%
        </span>
      </div>
    </div>
  )
}

export default Performance