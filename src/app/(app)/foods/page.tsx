import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Products from './Products'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'
import { Button } from '@/components/ui/button'

const Page = () => {
  const headerActions = (
    <Link href="/foods/add-food" passHref className="w-full sm:w-auto">
      <Button className="flex items-center gap-2 h-10 px-4 select-none w-full sm:w-auto bg-button-color font-semibold">
        <Plus className="w-4.5 h-4.5 text-white" />
        <span>Add Food</span>
      </Button>
    </Link>
  )

  return (
    <DashboardChildrenLayout
      title="Foods"
      subtitle="Manage your menu items"
      headerAction={headerActions}
    >
      <Products />
    </DashboardChildrenLayout>
  )
}

export default Page