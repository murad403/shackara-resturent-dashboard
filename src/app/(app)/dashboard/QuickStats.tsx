import React from 'react'

const QuickStats = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg select-none">
      <h3 className="text-lg font-bold text-title mb-5">Quick Stats</h3>

      <div className="divide-y divide-gray-100">
        {/* Today's Orders */}
        <div className="py-3.5 flex items-center justify-between first:pt-0">
          <span className="text-sm font-semibold text-subtitle/85">Today's Orders</span>
          <span className="text-sm font-bold text-title">2</span>
        </div>

        {/* Average Order Value */}
        <div className="py-3.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-subtitle/85">Average Order Value</span>
          <span className="text-sm font-bold text-title">$0</span>
        </div>

        {/* Success Rate */}
        <div className="py-3.5 flex items-center justify-between last:pb-0">
          <span className="text-sm font-semibold text-subtitle/85">Success Rate</span>
          <span className="text-sm font-bold text-green-600">0%</span>
        </div>
      </div>
    </div>
  )
}

export default QuickStats