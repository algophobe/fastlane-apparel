import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Package } from 'lucide-react'
import { useOrdersStore } from '@/hooks/useStore'
import { STORE_CONFIG } from '@/data/config'

export default function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>()
  const getOrder = useOrdersStore(s => s.getOrder)
  const order = id ? getOrder(id) : undefined

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] font-body mb-4">Order not found</p>
          <Link to="/" className="btn-ghost">← Back to Shop</Link>
        </div>
      </div>
    )
  }

  const paymentConfig = STORE_CONFIG.payments[order.paymentMethod]

  const statusInfo = {
    pending_payment: {
      icon: <Clock size={28} className="text-yellow-400" />,
      title: 'Awaiting Payment',
      desc: `Please send $${order.total.toFixed(2)} to ${paymentConfig.handle} and include your order ID.`,
      color: 'text-yellow-400',
    },
    pending_verification: {
      icon: <Clock size={28} className="text-blue-400" />,
      title: 'Payment Received — Verifying',
      desc: "We got your payment screenshot. We'll verify and process your order within 24 hours.",
      color: 'text-blue-400',
    },
    verified: {
      icon: <CheckCircle size={28} className="text-green-400" />,
      title: 'Payment Verified!',
      desc: "Your payment has been verified. We're preparing your order.",
      color: 'text-green-400',
    },
    shipped: {
      icon: <Package size={28} className="text-purple-400" />,
      title: 'Shipped!',
      desc: "Your order is on its way.",
      color: 'text-purple-400',
    },
    completed: {
      icon: <CheckCircle size={28} className="text-green-400" />,
      title: 'Order Complete',
      desc: 'Your order has been delivered. Enjoy!',
      color: 'text-green-400',
    },
    cancelled: {
      icon: <Clock size={28} className="text-red-400" />,
      title: 'Order Cancelled',
      desc: 'This order has been cancelled.',
      color: 'text-red-400',
    },
  }

  const info = statusInfo[order.status]

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">{info.icon}</div>
          <h1 className={`font-display text-4xl tracking-widest mb-3 ${info.color}`}>
            {info.title.toUpperCase()}
          </h1>
          <p className="text-[var(--text-secondary)] font-body">{info.desc}</p>
        </motion.div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[var(--text-muted)] mb-0.5">ORDER ID</div>
              <div className="font-mono text-white font-medium">{order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-[var(--text-muted)] mb-0.5">TOTAL</div>
              <div className="font-body font-semibold text-white">${order.total.toFixed(2)}</div>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-4 space-y-3 border-b border-[var(--border)]">
            {order.items.map(item => (
              <div key={item.cartItemId} className="flex items-center gap-3">
                <div className="w-10 h-12 rounded-lg overflow-hidden bg-[var(--surface-3)] flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center font-display text-white/20 text-xs">FL</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-white">{item.title}</p>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    {Object.values(item.selectedOptions).join(' / ')} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-body text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Shipping to */}
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <div className="text-xs font-mono text-[var(--text-muted)] mb-1.5">SHIPPING TO</div>
            <p className="text-sm font-body text-[var(--text-secondary)]">
              {order.customer.firstName} {order.customer.lastName}<br />
              {order.customer.address}{order.customer.address2 ? `, ${order.customer.address2}` : ''}<br />
              {order.customer.city}, {order.customer.state} {order.customer.zip}
            </p>
          </div>

          {/* Payment */}
          <div className="px-6 py-4">
            <div className="text-xs font-mono text-[var(--text-muted)] mb-1.5">PAYMENT METHOD</div>
            <p className="text-sm font-body text-white capitalize">{paymentConfig.displayName} — {paymentConfig.handle}</p>
            {order.status === 'pending_payment' && (
              <div className="mt-3 bg-[var(--surface-3)] rounded-xl p-3">
                <p className="text-xs font-body text-[var(--text-secondary)]">{paymentConfig.instructions}</p>
                <p className="text-xs font-mono text-[var(--text-muted)] mt-1">Include your order ID: <span className="text-white">{order.id}</span></p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-center space-y-3"
        >
          <p className="text-xs text-[var(--text-muted)] font-body">
            A confirmation has been saved. Questions? Email{' '}
            <a href={`mailto:${STORE_CONFIG.email}`} className="text-white hover:underline">{STORE_CONFIG.email}</a>
          </p>
          <Link to="/" className="btn-ghost inline-flex">← Keep Shopping</Link>
        </motion.div>
      </div>
    </div>
  )
}
