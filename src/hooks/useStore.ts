import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Order } from '@/types'
import { nanoid } from './nanoid'

// ─── CART STORE ───────────────────────────────────────────────────────────────

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  // actions
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  // computed
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        // Check if exact same product+variant already in cart
        const existing = items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        )
        if (existing) {
          set({
            items: items.map(i =>
              i.cartItemId === existing.cartItemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [...items, { ...item, cartItemId: nanoid() }],
            isOpen: true,
          })
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter(i => i.cartItemId !== cartItemId) })
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(cartItemId)
          return
        }
        set({
          items: get().items.map(i =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'fastlane-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// ─── ORDERS STORE ─────────────────────────────────────────────────────────────

interface OrdersStore {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  getOrder: (id: string) => Order | undefined
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      updateOrder: (id, updates) =>
        set({
          orders: get().orders.map(o =>
            o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
          ),
        }),

      getOrder: (id) => get().orders.find(o => o.id === id),
    }),
    { name: 'fastlane-orders' }
  )
)

// ─── ORDER UTILS ──────────────────────────────────────────────────────────────

export function generateOrderId(): string {
  const prefix = 'FL'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = nanoid(4).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
