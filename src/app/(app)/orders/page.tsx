"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, Eye } from 'lucide-react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { getOrders, Order } from '@/lib/ordersStore'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const loadOrders = () => {
    setOrders(getOrders())
  }

  useEffect(() => {
    loadOrders()
    window.addEventListener('orders-updated', loadOrders)
    return () => {
      window.removeEventListener('orders-updated', loadOrders)
    }
  }, [])

  // Filter orders by ID or customer name
  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cooking':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Rider Accepted':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Ready':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <DashboardChildrenLayout
      title="Orders"
      subtitle="Manage and track all your orders"
    >
      {/* Outer Card Wrapper */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg select-none">

        {/* Search Bar & Filter Row */}
        <div className="flex gap-3 mb-6 items-center">
          {/* Search Input Box */}
          <div className="relative flex items-center flex-1">
            <div className="absolute left-4 text-gray-400 pointer-events-none flex items-center justify-center">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm text-title transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color"
            />
          </div>

          {/* Funnel Filter Icon Button */}
          <button
            type="button"
            className="w-11 h-11 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shrink-0 transition-colors focus:outline-none focus:ring-1 focus:ring-button-color"
            title="Filter orders"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Data Table Container (Responsive overflow-x) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider pl-2 w-[12%]">
                  Order ID
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[28%]">
                  Customer
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">
                  Items
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">
                  Amount
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[16%]">
                  Status
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                  Time
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-2 text-right w-[10%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Order ID */}
                    <td className="py-4.5 pl-2 font-bold text-title text-sm whitespace-nowrap">
                      {order.id}
                    </td>

                    {/* Customer Info */}
                    <td className="py-4.5">
                      <div className="space-y-0.5">
                        <div className="font-bold text-title text-sm">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-subtitle">
                          {order.customerPhone}
                        </div>
                      </div>
                    </td>

                    {/* Items size */}
                    <td className="py-4.5 text-sm text-subtitle">
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </td>

                    {/* Amount value */}
                    <td className="py-4.5 font-bold text-title text-sm whitespace-nowrap">
                      ${order.price}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5">
                      <span className={cn(
                        "inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                        getStatusBadgeStyle(order.status)
                      )}>
                        {order.status}
                      </span>
                    </td>

                    {/* Relative Time */}
                    <td className="py-4.5 text-xs text-subtitle whitespace-nowrap">
                      {order.timeAgo}
                    </td>

                    {/* View Action Trigger */}
                    <td className="py-4.5 pr-2 text-right whitespace-nowrap">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-button-color hover:underline cursor-pointer focus:outline-none"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-subtitle font-medium">
                    No orders found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardChildrenLayout>
  )
}