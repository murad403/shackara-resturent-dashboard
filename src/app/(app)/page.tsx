import React from 'react'
import Link from 'next/link'
import { ClipboardList, Plus } from 'lucide-react'
import Stats from './dashboard/Stats'
import RecentOrders from './dashboard/RecentOrders'
import QuickStats from './dashboard/QuickStats'
import Performance from './dashboard/Performance'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Button } from '@/components/ui/button'

const Page = () => {
  const headerActions = (
    <>
      <Link href="/orders" passHref className="w-full sm:w-auto">
        <Button variant="outline" className="flex items-center gap-2 h-10 px-4 select-none w-full sm:w-auto font-semibold">
          <ClipboardList className="w-4 h-4 text-gray-500" />
          <span>View Orders</span>
        </Button>
      </Link>
      
      <Link href="/foods/add-food" passHref className="w-full sm:w-auto">
        <Button className="flex items-center gap-2 h-10 px-4 select-none w-full sm:w-auto bg-button-color font-semibold">
          <Plus className="w-4 h-4 text-white" />
          <span>Add Product</span>
        </Button>
      </Link>
    </>
  )

  return (
    <DashboardChildrenLayout
      title="Dashboard Overview"
      subtitle="Monitor your restaurant performance"
      headerAction={headerActions}
    >
      {/* Stats Cards Row */}
      <Stats />

      {/* Main Grid: Left RecentOrders, Right QuickStats & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <QuickStats />
          <Performance />
        </div>
      </div>
    </DashboardChildrenLayout>
  )
}

export default Page