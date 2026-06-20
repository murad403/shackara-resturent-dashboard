import React from 'react'
import { Eye, Clock } from 'lucide-react'

interface OrderItem {
  id: string
  customerName: string
  itemCount: number
  timeAgo: string
  price: number
  status: 'Pending' | 'Cooking' | 'Rider Accepted'
}

const RecentOrders = () => {
  const orders: OrderItem[] = [
    {
      id: 'ORD-001',
      customerName: 'Ahmed Khan',
      itemCount: 2,
      timeAgo: '10 minutes ago',
      price: 980,
      status: 'Pending',
    },
    {
      id: 'ORD-002',
      customerName: 'Fatima Rahman',
      itemCount: 1,
      timeAgo: '30 minutes ago',
      price: 650,
      status: 'Cooking',
    },
    {
      id: 'ORD-003',
      customerName: 'Shakib Hasan',
      itemCount: 2,
      timeAgo: 'about 1 hour ago',
      price: 2350,
      status: 'Rider Accepted',
    },
  ]

  const getStatusStyle = (status: OrderItem['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Cooking':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Rider Accepted':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-title">Recent Orders</h3>
        <button className="text-sm font-semibold text-button-color hover:underline cursor-pointer focus:outline-none">
          View All
        </button>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order.id} className="py-4.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            {/* Left Details */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-title text-sm">{order.id}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-xs text-subtitle flex items-center gap-1.5">
                <span className="font-medium">{order.customerName}</span>
                <span className="text-gray-300">•</span>
                <span>{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>{order.timeAgo}</span>
              </div>
            </div>

            {/* Right Price & View Button */}
            <div className="text-right space-y-1.5 shrink-0">
              <div className="font-bold text-title text-base">
                ৳{order.price}
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-button-color hover:underline cursor-pointer focus:outline-none ml-auto">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentOrders