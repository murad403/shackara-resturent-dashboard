"use client"

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Check, 
  Clock, 
  Flame, 
  Package, 
  X,
  AlertCircle
} from 'lucide-react'
import { getOrders, saveOrders, Order, OrderTimelineStep } from '@/lib/ordersStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const { id } = use(params)

  const [orders, setOrders] = useState<Order[]>([])
  const [order, setOrder] = useState<Order | null>(null)

  const loadData = () => {
    const list = getOrders()
    setOrders(list)
    const target = list.find((o) => o.id === id)
    if (target) {
      setOrder(target)
    }
  }

  useEffect(() => {
    loadData()
    window.addEventListener('orders-updated', loadData)
    return () => {
      window.removeEventListener('orders-updated', loadData)
    }
  }, [id])

  const getCurrentFormattedTime = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    // Convert e.g., "Jun 20, 2026, 10:22 AM" -> "Jun 20, 2026 • 10:22 AM"
    return now.toLocaleString('en-US', options).replace(',', ' •')
  }

  // Update order status and corresponding timeline step
  const handleUpdateStatus = (newStatus: Order['status'], stepNameToComplete: string) => {
    if (!order) return

    const updatedTimeline = order.timeline.map((step) => {
      if (step.name === stepNameToComplete) {
        return {
          ...step,
          completed: true,
          time: getCurrentFormattedTime()
        }
      }
      return step
    })

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      timeline: updatedTimeline
    }

    // If order was accepted, change payment status or simulate paid status if relevant
    if (newStatus === 'Accepted') {
      updatedOrder.paymentStatus = 'Paid' // Simulated payment authorization
    }

    const updatedList = orders.map((o) => (o.id === order.id ? updatedOrder : o))
    setOrder(updatedOrder)
    setOrders(updatedList)
    saveOrders(updatedList)
  }

  const handleReject = () => {
    if (!order) return
    const isConfirmed = window.confirm(`Are you sure you want to reject order ${order.id}?`)
    if (isConfirmed) {
      const updatedList = orders.filter((o) => o.id !== order.id)
      saveOrders(updatedList)
      router.push('/orders')
    }
  }

  if (!order) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto space-y-4 shadow-lg select-none">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-title">Order Not Found</h2>
        <p className="text-sm text-subtitle">The order identifier you requested does not exist or has been deleted.</p>
        <Link href="/orders" passHref>
          <Button className="bg-button-color font-semibold cursor-pointer">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-10 select-none">
      {/* Page Header with Back Navigation */}
      <div className="flex items-center gap-4">
        <Link 
          href="/orders" 
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer shadow-xs focus:outline-none shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold text-title tracking-tight">
            Order Details
          </h1>
          <p className="text-xs text-subtitle font-semibold">
            {order.id}
          </p>
        </div>
      </div>

      {/* Main Grid: Left spans 2 cols, Right spans 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Items & Timeline) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-bold text-title mb-4 border-b border-gray-100 pb-3">
              Order Items
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex justify-between items-center first:pt-0">
                  <div className="space-y-1">
                    <div className="font-bold text-title text-sm">{item.name}</div>
                    <div className="text-xs text-subtitle font-medium">
                      Quantity: {item.quantity} × ৳{item.price}
                    </div>
                  </div>
                  <div className="font-bold text-title text-sm whitespace-nowrap">
                    ৳{item.quantity * item.price}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total Row */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-3">
              <span className="font-bold text-title text-sm md:text-base">Total Amount</span>
              <span className="font-bold text-title text-sm md:text-base">৳{order.price}</span>
            </div>
          </div>

          {/* Order Timeline Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-bold text-title mb-6 border-b border-gray-100 pb-3">
              Order Timeline
            </h3>
            
            <div className="space-y-0.5 pl-1.5">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative flex gap-4 pb-8 last:pb-0 group">
                  {/* Vertical linking line */}
                  <div className={cn(
                    "w-[2px] bg-gray-100 absolute left-[15px] top-[28px] bottom-[-8px] group-last:hidden",
                    step.completed && order.timeline[idx + 1]?.completed ? "bg-[#16A34A]" : ""
                  )} />

                  {/* Step Milestone Circle */}
                  <div className="relative z-10 shrink-0">
                    {step.completed ? (
                      <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center border-2 border-green-50 shadow-xs">
                        <Check className="w-4.5 h-4.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white text-gray-300 flex items-center justify-center shadow-xs">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="space-y-1.5 pt-1">
                    <div className={cn(
                      "text-sm font-bold",
                      step.completed ? "text-title" : "text-gray-400"
                    )}>
                      {step.name}
                    </div>
                    {step.completed && step.time && (
                      <div className="text-[11px] text-subtitle font-medium">
                        {step.time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Customer Info & Actions) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Details Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-bold text-title mb-5 border-b border-gray-100 pb-3">
              Customer Details
            </h3>
            
            <div className="space-y-5">
              {/* Customer Name */}
              <div className="flex gap-3">
                <User className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-subtitle/85">Customer Name</div>
                  <div className="text-sm font-bold text-title">{order.customerName}</div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex gap-3">
                <Phone className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-subtitle/85">Phone Number</div>
                  <div className="text-sm font-bold text-title">{order.customerPhone}</div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex gap-3">
                <MapPin className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-subtitle/85">Delivery Address</div>
                  <div className="text-sm font-bold text-title leading-relaxed">{order.deliveryAddress}</div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex gap-3">
                <CreditCard className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-subtitle/85">Payment Status</div>
                  <span className={cn(
                    "inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                    order.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  )}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-bold text-title mb-5 border-b border-gray-100 pb-3">
              Actions
            </h3>
            
            <div className="space-y-3">
              {/* Contextual actions depending on order status */}
              {order.status === 'Pending' && (
                <>
                  <Button
                    type="button"
                    onClick={() => handleUpdateStatus('Accepted', 'Accepted')}
                    className="bg-[#00AC47] hover:bg-[#00963d] text-white w-full h-10.5 flex items-center justify-center gap-2 rounded-lg font-bold shadow-sm cursor-pointer border-0 focus:outline-none"
                  >
                    <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                    <span>Accept Order</span>
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700 text-white w-full h-10.5 flex items-center justify-center gap-2 rounded-lg font-bold shadow-sm cursor-pointer border-0 focus:outline-none"
                  >
                    <X className="w-4.5 h-4.5 stroke-[2.5]" />
                    <span>Reject Order</span>
                  </Button>
                </>
              )}

              {order.status === 'Accepted' && (
                <Button
                  type="button"
                  onClick={() => handleUpdateStatus('Cooking', 'Cooking')}
                  className="bg-button-color hover:opacity-95 text-white w-full h-10.5 flex items-center justify-center gap-2 rounded-lg font-bold shadow-sm cursor-pointer border-0 focus:outline-none"
                >
                  <Flame className="w-4.5 h-4.5" />
                  <span>Start Cooking</span>
                </Button>
              )}

              {order.status === 'Cooking' && (
                <Button
                  type="button"
                  onClick={() => handleUpdateStatus('Ready', 'Ready')}
                  className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white w-full h-10.5 flex items-center justify-center gap-2 rounded-lg font-bold shadow-sm cursor-pointer border-0 focus:outline-none"
                >
                  <Package className="w-4.5 h-4.5" />
                  <span>Mark Ready for Pickup</span>
                </Button>
              )}

              {order.status !== 'Pending' && order.status !== 'Accepted' && order.status !== 'Cooking' && (
                <div className="text-center py-4 border border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                  <p className="text-xs text-subtitle font-semibold">No actions available</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}