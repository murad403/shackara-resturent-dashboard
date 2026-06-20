"use client"

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  isActive: boolean
  images: string[] // supports multiple image URLs
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Chicken Burger",
    price: 350,
    category: "Burgers",
    description: "Juicy grilled chicken burger with lettuce, tomato, and special sauce",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"]
  },
  {
    id: "2",
    name: "Margherita Pizza",
    price: 650,
    category: "Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60"]
  },
  {
    id: "3",
    name: "Pasta Carbonara",
    price: 450,
    category: "Pasta",
    description: "Creamy pasta with bacon, eggs, and parmesan cheese",
    isActive: false,
    images: ["https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60"]
  },
  {
    id: "4",
    name: "Caesar Salad",
    price: 280,
    category: "Salads",
    description: "Fresh romaine lettuce with caesar dressing and croutons",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"]
  }
]

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS
  const stored = localStorage.getItem('vendor_products')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return DEFAULT_PRODUCTS
    }
  }
  localStorage.setItem('vendor_products', JSON.stringify(DEFAULT_PRODUCTS))
  return DEFAULT_PRODUCTS
}

export function saveProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vendor_products', JSON.stringify(products))
    window.dispatchEvent(new Event('products-updated'))
  }
}
