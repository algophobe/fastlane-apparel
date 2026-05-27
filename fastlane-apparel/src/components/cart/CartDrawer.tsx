import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/hooks/useStore'
import { STORE_CONFIG } from '@/data/config'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore()
  const navigate = useNavigate()
  const sub = subtotal()
  const shipping = sub >= STORE_CONFIG.shipping.freeThreshold ? 0 : STORE_CONFIG.shipping.flatRate
  const total = sub + shipping

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[var(--surface-1)] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-white" />
                <h2 className="font-body font-semibold text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="bg-[var(--surface-4)] text-[var(--text-secondary)] text-xs font-mono px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <ShoppingBag size={40} className="text-[var(--text-muted)]" />
                  <p className="text-[var(--text-secondary)] font-body text-sm">Your cart is empty</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.cartItemId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 py-2">
                        {/* Image */}
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-[var(--surface-3)] flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-display text-lg text-white/20">FL</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-body font-medium text-white line-clamp-1">{item.title}</h4>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-[var(--text-muted)] hover:text-white transition-colors flex-shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Options */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.selectedOptions).map(([k, v]) => (
                              <span key={k} className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full">
                                {v}
                              </span>
                            ))}
                          </div>

                          {/* Price + Qty */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-[var(--surface-3)] rounded-full px-1 py-1">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--surface-5)] transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-mono text-white w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--surface-5)] transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-body font-semibold text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--border)] px-6 py-5 space-y-4">
                {/* Totals */}
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span>${sub.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `$${shipping}`}</span>
                  </div>
                  {sub < STORE_CONFIG.shipping.freeThreshold && (
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Add ${(STORE_CONFIG.shipping.freeThreshold - sub).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-[var(--border)]">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
