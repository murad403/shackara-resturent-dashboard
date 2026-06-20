"use client"

import React, { useState } from 'react'
import { Bell, Package, CheckCircle2, Navigation, Clock } from 'lucide-react'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: string
  title: string
  message: string
  timeAgo: string
  isUnread: boolean
  type: 'order' | 'delivery' | 'success'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New Order Received',
      message: 'Order #ORD-001 from Ahmed Khan - BDT 980',
      timeAgo: '18 minutes ago',
      isUnread: true,
      type: 'order'
    },
    {
      id: '2',
      title: 'Rider Accepted Delivery',
      message: 'Rahim Ali accepted order #ORD-003',
      timeAgo: '23 minutes ago',
      isUnread: true,
      type: 'delivery'
    },
    {
      id: '3',
      title: 'Order Delivered',
      message: 'Order #ORD-120 has been delivered successfully',
      timeAgo: 'about 2 hours ago',
      isUnread: false,
      type: 'success'
    }
  ])

  const unreadCount = notifications.filter(n => n.isUnread).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })))
  }

  const getIconContainer = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return {
          icon: <Package className="w-5 h-5 text-blue-600" />,
          bg: 'bg-blue-100'
        }
      case 'delivery':
        return {
          icon: <Navigation className="w-5 h-5 text-purple-600 rotate-45" />,
          bg: 'bg-purple-100'
        }
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
          bg: 'bg-green-100'
        }
    }
  }

  const headerActions = (
    <Button
      variant="outline"
      className="flex items-center gap-2 h-10 px-4 font-semibold select-none border-gray-200 text-gray-700 bg-white"
    >
      <Bell className="w-4 h-4 text-gray-500" />
      <span>{unreadCount}</span>
    </Button>
  )

  return (

    <div className='space-y-4 md:space-y-6 max-w-5xl select-none mx-auto'>
      <div className='flex justify-between items-center'>
        <div className='space-y-2'>
          <h2 className='text-xl md:text-2xl font-bold text-title'>Notifications</h2>
          <p className='text-gray-500 text-xs md:text-sm'>Manage your notifications preferences</p>
        </div>
        <div className='border border-gray-300 rounded-md flex items-center gap-2 px-2 py-1'>
          <Bell size={17}/>
          <span>3</span>
        </div>
      </div>
      <div className="space-y-4 md:space-y-6 ">

        {/* Main Notifications Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-lg">
          <div className="divide-y divide-gray-100">
            {notifications.map((item) => {
              const { icon, bg } = getIconContainer(item.type)
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-6 flex gap-4 items-start transition-colors relative",
                    item.isUnread ? "bg-[#FFFBEB]/45" : "bg-white"
                  )}
                >
                  {/* Left Icon Block */}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs", bg)}>
                    {icon}
                  </div>

                  {/* Middle Content Block */}
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-title text-sm md:text-base leading-snug">
                      {item.title}
                    </div>
                    <div className="text-xs md:text-sm text-subtitle font-medium leading-normal">
                      {item.message}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 pt-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 stroke-[1.8]" />
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>

                  {/* Right Unread Dot Indicator */}
                  {item.isUnread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-button-color shrink-0 mt-2.5" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-title">Quick Actions</h3>
            <p className="text-xs text-subtitle font-medium">Manage your notifications</p>
          </div>
          <Button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="bg-button-color font-semibold cursor-pointer shrink-0 disabled:opacity-50 disabled:pointer-events-none w-auto"
          >
            Mark All as Read
          </Button>
        </div>

      </div>
    </div>
  )
}