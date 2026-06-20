"use client"

export interface OrderTimelineStep {
  name: string
  completed: boolean
  time?: string
}

export interface OrderItemDetails {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
  itemCount: number
  price: number
  status: 'Pending' | 'Cooking' | 'Rider Accepted' | 'Accepted' | 'Ready' | 'Delivered'
  timeAgo: string
  items: OrderItemDetails[]
  timeline: OrderTimelineStep[]
}

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Ahmed Khan',
    customerPhone: '+880 1711-223344',
    deliveryAddress: 'House 12, Road 5, Dhanmondi, Dhaka',
    paymentStatus: 'Pending',
    itemCount: 2,
    price: 980,
    status: 'Pending',
    timeAgo: '26 minutes ago',
    items: [
      { name: 'Chicken Burger', quantity: 2, price: 350 },
      { name: 'Caesar Salad', quantity: 1, price: 280 }
    ],
    timeline: [
      { name: 'Order Placed', completed: true, time: 'May 11, 2026 • 10:22 AM' },
      { name: 'Accepted', completed: false },
      { name: 'Cooking', completed: false },
      { name: 'Ready', completed: false },
      { name: 'Rider Accepted', completed: false },
      { name: 'Delivered', completed: false }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Fatima Rahman',
    customerPhone: '+880 1722-334455',
    deliveryAddress: 'Flat 4A, House 24, Road 2, Banani, Dhaka',
    paymentStatus: 'Paid',
    itemCount: 1,
    price: 650,
    status: 'Cooking',
    timeAgo: 'about 1 hour ago',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 650 }
    ],
    timeline: [
      { name: 'Order Placed', completed: true, time: 'May 11, 2026 • 09:15 AM' },
      { name: 'Accepted', completed: true, time: 'May 11, 2026 • 09:20 AM' },
      { name: 'Cooking', completed: true, time: 'May 11, 2026 • 09:25 AM' },
      { name: 'Ready', completed: false },
      { name: 'Rider Accepted', completed: false },
      { name: 'Delivered', completed: false }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Shakib Hasan',
    customerPhone: '+880 1744-556677',
    deliveryAddress: 'Sector 4, Road 11, Uttara, Dhaka',
    paymentStatus: 'Paid',
    itemCount: 2,
    price: 2350,
    status: 'Rider Accepted',
    timeAgo: 'about 1 hour ago',
    items: [
      { name: 'Family Pizza Platter', quantity: 1, price: 1700 },
      { name: 'Soft Drinks Pack', quantity: 1, price: 650 }
    ],
    timeline: [
      { name: 'Order Placed', completed: true, time: 'May 11, 2026 • 08:05 AM' },
      { name: 'Accepted', completed: true, time: 'May 11, 2026 • 08:10 AM' },
      { name: 'Cooking', completed: true, time: 'May 11, 2026 • 08:20 AM' },
      { name: 'Ready', completed: true, time: 'May 11, 2026 • 08:35 AM' },
      { name: 'Rider Accepted', completed: true, time: 'May 11, 2026 • 08:45 AM' },
      { name: 'Delivered', completed: false }
    ]
  }
]

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return DEFAULT_ORDERS
  const stored = localStorage.getItem('vendor_orders')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return DEFAULT_ORDERS
    }
  }
  localStorage.setItem('vendor_orders', JSON.stringify(DEFAULT_ORDERS))
  return DEFAULT_ORDERS
}

export function saveOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vendor_orders', JSON.stringify(orders))
    window.dispatchEvent(new Event('orders-updated'))
  }
}
