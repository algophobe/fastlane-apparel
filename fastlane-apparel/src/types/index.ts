// ─── PRODUCT TYPES ───────────────────────────────────────────────────────────

export type ProductType = 'apparel' | 'poster' | 'phone-case' | 'accessory' | 'sticker' | string

export interface VariantOption {
  label: string  // "Size", "Color", "Finish", "Device"
  values: string[]
}

export interface ProductVariant {
  id: string
  options: Record<string, string>  // { "Size": "M", "Color": "Black" }
  price: number
  compareAtPrice?: number
  inventory: number
  sku?: string
  image?: string  // optional variant-specific image
}

export interface Product {
  id: string
  title: string
  type: ProductType
  description: string
  images: string[]
  basePrice: number
  salePrice?: number
  tags: string[]
  featured?: boolean
  variantOptions: VariantOption[]   // defines what variant dimensions exist
  variants: ProductVariant[]
  createdAt: string
}

// ─── CART TYPES ──────────────────────────────────────────────────────────────

export interface CartItem {
  cartItemId: string         // unique ID per line item
  productId: string
  variantId: string
  title: string
  image: string
  selectedOptions: Record<string, string>
  price: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// ─── ORDER TYPES ─────────────────────────────────────────────────────────────

export type PaymentMethod = 'cashapp' | 'venmo' | 'zelle'
export type OrderStatus = 'pending_payment' | 'pending_verification' | 'verified' | 'shipped' | 'completed' | 'cancelled'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  orderNotes?: string
}

export interface Order {
  id: string
  items: CartItem[]
  customer: CustomerInfo
  paymentMethod: PaymentMethod
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  paymentScreenshot?: string
  createdAt: string
  updatedAt: string
}

// ─── ADMIN TYPES ─────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number
  pendingVerification: number
  revenue: number
  lowInventory: number
}
