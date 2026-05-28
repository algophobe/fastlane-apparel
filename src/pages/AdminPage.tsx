import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, DollarSign, AlertTriangle, Check, X, Eye, ChevronDown, ChevronRight } from 'lucide-react'
import { useOrdersStore } from '@/hooks/useStore'
import { PRODUCTS } from '@/data/products'
import type { Order, OrderStatus } from '@/types'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type AdminTab = 'orders' | 'products'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending Payment',
  pending_verification: 'Awaiting Verification',
  verified: 'Verified',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'text-yellow-400 bg-yellow-400/10',
  pending_verification: 'text-blue-400 bg-blue-400/10',
  verified: 'text-green-400 bg-green-400/10',
  shipped: 'text-purple-400 bg-purple-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
}


export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('orders')
  const { orders, updateOrder } = useOrdersStore()
  const navigate = useNavigate()

  useEffect(() => {
    const password = prompt('Enter admin password')

    if (password !== 'ayrtonsenna12') {
      navigate('/')
    }
  }, [])


  const stats = {
    totalOrders: orders.length,
    pendingVerification: orders.filter(o => o.status === 'pending_verification').length,
    revenue: orders.filter(o => ['verified', 'shipped', 'completed'].includes(o.status)).reduce((s, o) => s + o.total, 0),
    lowInventory: PRODUCTS.flatMap(p => p.variants).filter(v => v.inventory <= 3).length,
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--brand-red)] animate-pulse" />
            <span className="text-xs font-mono text-[var(--text-muted)] tracking-wider uppercase">Admin Panel</span>
          </div>
          <h1 className="font-display text-4xl tracking-widest text-white">DASHBOARD</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={18} />, color: 'text-white' },
            { label: 'Needs Verification', value: stats.pendingVerification, icon: <AlertTriangle size={18} />, color: stats.pendingVerification > 0 ? 'text-yellow-400' : 'text-white' },
            { label: 'Revenue Confirmed', value: `$${stats.revenue.toFixed(2)}`, icon: <DollarSign size={18} />, color: 'text-green-400' },
            { label: 'Low Inventory', value: stats.lowInventory, icon: <Package size={18} />, color: stats.lowInventory > 0 ? 'text-[var(--brand-red)]' : 'text-white' },
          ].map(stat => (
            <div key={stat.label} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
              <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className={`text-2xl font-body font-semibold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs font-mono text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['orders', 'products'] as AdminTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                tab === t ? 'bg-white text-black' : 'text-[var(--text-secondary)] border border-[var(--border)] hover:text-white'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'orders' && <OrdersTab orders={orders} updateOrder={updateOrder} />}
        {tab === 'products' && <ProductsTab />}
      </div>
    </div>
  )
}

// ── ORDERS TAB ───────────────────────────────────────────────────────────────

function OrdersTab({
  orders, updateOrder,
}: {
  orders: Order[]
  updateOrder: (id: string, updates: Partial<Order>) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null)

  if (orders.length === 0) {
    return (
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-12 text-center">
        <ShoppingBag size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-[var(--text-secondary)] font-body">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <motion.div
          key={order.id}
          layout
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl overflow-hidden"
        >
          {/* Row */}
          <button
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-white">{order.id}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-body">
                {order.customer.firstName} {order.customer.lastName} · {order.customer.email}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-body font-semibold text-white">${order.total.toFixed(2)}</div>
              <div className="text-[10px] font-mono text-[var(--text-muted)]">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            {expanded === order.id ? <ChevronDown size={16} className="text-[var(--text-muted)]" /> : <ChevronRight size={16} className="text-[var(--text-muted)]" />}
          </button>

          {/* Expanded */}
          {expanded === order.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 pb-5 border-t border-[var(--border)] pt-4 space-y-4"
            >
              {/* Items */}
              <div>
                <div className="text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">Items</div>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.cartItemId} className="flex items-center gap-2 text-sm font-body">
                      <span className="text-white">{item.title}</span>
                      <span className="text-[var(--text-muted)]">{Object.values(item.selectedOptions).join(' / ')}</span>
                      <span className="text-[var(--text-muted)]">× {item.quantity}</span>
                      <span className="ml-auto text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <div className="text-xs font-mono text-[var(--text-muted)] mb-1 uppercase tracking-wider">Shipping To</div>
                <p className="text-sm font-body text-[var(--text-secondary)]">
                  {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}
                </p>
              </div>

              {/* Payment screenshot */}
              {order.paymentScreenshot && (
                <div>
                  <div className="text-xs font-mono text-[var(--text-muted)] mb-2 uppercase tracking-wider">Payment Proof</div>
                  <button
                    onClick={() => setScreenshotModal(order.paymentScreenshot!)}
                    className="flex items-center gap-2 text-xs font-body text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Eye size={14} /> View Screenshot
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {order.status === 'pending_verification' && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'verified' })}
                    className="flex items-center gap-1.5 text-xs font-body bg-green-400/10 text-green-400 border border-green-400/20 px-3 py-2 rounded-lg hover:bg-green-400/20 transition-colors"
                  >
                    <Check size={13} /> Verify Payment
                  </button>
                )}
                {order.status === 'verified' && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'shipped' })}
                    className="flex items-center gap-1.5 text-xs font-body bg-purple-400/10 text-purple-400 border border-purple-400/20 px-3 py-2 rounded-lg hover:bg-purple-400/20 transition-colors"
                  >
                    <Package size={13} /> Mark Shipped
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'completed' })}
                    className="flex items-center gap-1.5 text-xs font-body bg-green-400/10 text-green-400 border border-green-400/20 px-3 py-2 rounded-lg hover:bg-green-400/20 transition-colors"
                  >
                    <Check size={13} /> Mark Completed
                  </button>
                )}
                {!['cancelled', 'completed'].includes(order.status) && (
                  <button
                    onClick={() => updateOrder(order.id, { status: 'cancelled' })}
                    className="flex items-center gap-1.5 text-xs font-body bg-red-400/10 text-red-400 border border-red-400/20 px-3 py-2 rounded-lg hover:bg-red-400/20 transition-colors"
                  >
                    <X size={13} /> Cancel
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setScreenshotModal(null)}
        >
          <div className="relative max-w-lg w-full">
            <img src={screenshotModal} alt="Payment proof" className="w-full rounded-2xl" />
            <button
              onClick={() => setScreenshotModal(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 rounded-full text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PRODUCTS TAB ─────────────────────────────────────────────────────────────

function ProductsTab() {
  return (
    <div className="space-y-3">
      {PRODUCTS.map(product => (
        <div key={product.id} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-16 rounded-xl overflow-hidden bg-[var(--surface-3)] flex-shrink-0">
              {product.images[0]
                ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center font-display text-white/20 text-sm">FL</div>
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-sm font-body font-semibold text-white">{product.title}</h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full">
                  {product.type}
                </span>
              </div>
              <p className="text-xs font-body text-[var(--text-secondary)] line-clamp-1 mb-2">{product.description}</p>

              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="text-[var(--text-muted)]">{product.variants.length} variants</span>
                <span className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-muted)]">
                  {product.variants.reduce((s, v) => s + v.inventory, 0)} in stock
                </span>
                {product.variants.some(v => v.inventory <= 3) && (
                  <>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-[var(--brand-red)]">
                      {product.variants.filter(v => v.inventory <= 3).length} low
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-sm font-body font-semibold text-white">${product.basePrice}</div>
              {product.salePrice && (
                <div className="text-xs font-body text-[var(--brand-red)]">Sale: ${product.salePrice}</div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="bg-[var(--surface-2)] border border-dashed border-[var(--border)] rounded-2xl p-6 text-center">
        <p className="text-xs font-mono text-[var(--text-muted)] mb-1">To add products, edit:</p>
        <code className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-3)] px-3 py-1 rounded-lg">
          src/data/products.ts
        </code>
      </div>
    </div>
  )
}
