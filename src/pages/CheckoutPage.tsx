import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore, useOrdersStore, generateOrderId } from '@/hooks/useStore'
import { STORE_CONFIG } from '@/data/config'
import type { CustomerInfo, PaymentMethod, Order } from '@/types'
import toast from 'react-hot-toast'

type Step = 'info' | 'payment' | 'proof'

const EMPTY_CUSTOMER: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  orderNotes: '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()

  const { items, subtotal, clearCart } = useCartStore()
  const { addOrder } = useOrdersStore()

  const [step, setStep] = useState<Step>('info')
  const [customer, setCustomer] =
    useState<CustomerInfo>(EMPTY_CUSTOMER)

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null)

  const [proofFile, setProofFile] =
    useState<File | null>(null)

  const [orderId] = useState(() => generateOrderId())

  const [submitting, setSubmitting] = useState(false)

  const sub = subtotal()

  const shipping =
    sub >= STORE_CONFIG.shipping.freeThreshold
      ? 0
      : STORE_CONFIG.shipping.flatRate

  const total = sub + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] font-body mb-4">
            Your cart is empty
          </p>

          <button
            onClick={() => navigate('/')}
            className="btn-ghost"
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setStep('payment')

    window.scrollTo(0, 0)
  }

  const handlePaymentSelect = (
    method: PaymentMethod
  ) => {
    setPaymentMethod(method)

    setStep('proof')

    window.scrollTo(0, 0)
  }

  const handleProofSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!paymentMethod) return

    setSubmitting(true)

    try {
      let screenshotData: string | undefined

      if (proofFile) {
        screenshotData =
          await new Promise<string>((resolve) => {
            const reader = new FileReader()

            reader.onload = () =>
              resolve(reader.result as string)

            reader.readAsDataURL(proofFile)
          })
      }

      const order: Order = {
        id: orderId,
        items,
        customer,
        paymentMethod,
        subtotal: sub,
        shipping,
        total,
        status: proofFile
          ? 'pending_verification'
          : 'pending_payment',
        paymentScreenshot: screenshotData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addOrder(order)

      clearCart()

      toast.success('Order placed successfully')

      navigate(`/order/${orderId}`)
    } catch (err) {
      console.error(err)

      toast.error('Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="font-display text-3xl tracking-widest text-white">
              CHECKOUT
            </h1>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-3 text-xs font-mono">
            {(
              ['info', 'payment', 'proof'] as Step[]
            ).map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-3"
              >
                <div
                  className={`flex items-center gap-1.5 ${
                    step === s
                      ? 'text-white'
                      : ['info', 'payment', 'proof'].indexOf(
                            step
                          ) > i
                        ? 'text-green-400'
                        : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                      step === s
                        ? 'border-white bg-white text-black'
                        : ['info', 'payment', 'proof'].indexOf(
                              step
                            ) > i
                          ? 'border-green-400 bg-green-400 text-black'
                          : 'border-current'
                    }`}
                  >
                    {i + 1}
                  </span>

                  {s === 'info'
                    ? 'Info'
                    : s === 'payment'
                      ? 'Payment'
                      : 'Proof'}
                </div>

                {i < 2 && (
                  <span className="text-[var(--text-muted)]">
                    ›
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* LEFT */}
          <div>
            {step === 'info' && (
              <InfoStep
                customer={customer}
                onChange={setCustomer}
                onSubmit={handleInfoSubmit}
              />
            )}

            {step === 'payment' && (
              <PaymentStep
                onSelect={handlePaymentSelect}
                orderId={orderId}
                total={total}
              />
            )}

            {step === 'proof' &&
              paymentMethod && (
                <ProofStep
                  method={paymentMethod}
                  orderId={orderId}
                  total={total}
                  file={proofFile}
                  onFileChange={setProofFile}
                  onSubmit={handleProofSubmit}
                  submitting={submitting}
                />
              )}
          </div>

          {/* RIGHT */}
          <OrderSummary
            items={items}
            sub={sub}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   INFO STEP
========================================================= */

function InfoStep({
  customer,
  onChange,
  onSubmit,
}: {
  customer: CustomerInfo
  onChange: (c: CustomerInfo) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const set =
    (k: keyof CustomerInfo) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >
    ) =>
      onChange({
        ...customer,
        [k]: e.target.value,
      })

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="font-body font-semibold text-white text-lg mb-4">
          Contact
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">
              First Name
            </label>

            <input
              className="input"
              required
              value={customer.firstName}
              onChange={set('firstName')}
            />
          </div>

          <div>
            <label className="label">
              Last Name
            </label>

            <input
              className="input"
              required
              value={customer.lastName}
              onChange={set('lastName')}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="label">
            Email
          </label>

          <input
            className="input"
            type="email"
            required
            value={customer.email}
            onChange={set('email')}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        Continue to Payment
        <ArrowRight size={16} />
      </button>
    </motion.form>
  )
}

/* =========================================================
   PAYMENT STEP
========================================================= */

function PaymentStep({
  onSelect,
  orderId,
  total,
}: {
  onSelect: (m: PaymentMethod) => void
  orderId: string
  total: number
}) {
  const methods = [
    {
      id: 'cashapp' as PaymentMethod,
      name: 'Cash App',
      handle:
        STORE_CONFIG.payments.cashapp.handle,
      color:
        STORE_CONFIG.payments.cashapp.color,
      icon: '💸',
      instructions:
        STORE_CONFIG.payments.cashapp.instructions,
    },

    {
      id: 'venmo' as PaymentMethod,
      name: 'Venmo',
      handle:
        STORE_CONFIG.payments.venmo.handle,
      color:
        STORE_CONFIG.payments.venmo.color,
      icon: '🔵',
      instructions:
        STORE_CONFIG.payments.venmo.instructions,
    },

    {
      id: 'zelle' as PaymentMethod,
      name: 'Zelle',
      handle:
        STORE_CONFIG.payments.zelle.handle,
      color:
        STORE_CONFIG.payments.zelle.color,
      icon: '🟣',
      instructions:
        STORE_CONFIG.payments.zelle.instructions,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="mb-6">
        <h2 className="font-body font-semibold text-white text-lg">
          Choose Payment Method
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Send{' '}
          <span className="text-white font-semibold">
            ${total.toFixed(2)}
          </span>{' '}
          then upload proof.
        </p>
      </div>

      {methods.map((method) => (
        <PaymentCard
          key={method.id}
          method={method}
          orderId={orderId}
          onSelect={() =>
            onSelect(method.id)
          }
        />
      ))}
    </motion.div>
  )
}

function PaymentCard({
  method,
  orderId,
  onSelect,
}: {
  method: {
    id: PaymentMethod
    name: string
    handle: string
    color: string
    icon: string
    instructions: string
  }

  orderId: string

  onSelect: () => void
}) {
  const [copied, setCopied] =
    useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(
      method.handle
    )

    setCopied(true)

    toast.success('Copied!')

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div
      className="border border-[var(--border)] rounded-2xl p-5"
      style={{
        background: `${method.color}08`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold text-white text-lg">
            {method.name}
          </div>

          <div
            className="font-mono text-sm"
            style={{
              color: method.color,
            }}
          >
            {method.handle}
          </div>
        </div>

        <span className="text-2xl">
          {method.icon}
        </span>
      </div>

      <div className="bg-black/30 rounded-xl p-3 mb-4">
        <p className="text-xs text-[var(--text-secondary)]">
          {method.instructions}
        </p>

        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
          Order ID: {orderId}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copy}
          className="border border-[var(--border)] px-3 py-2 rounded-lg text-xs"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={onSelect}
          className="flex-1 rounded-lg px-3 py-2 text-black text-xs font-semibold"
          style={{
            background: method.color,
          }}
        >
          I Paid →
        </button>
      </div>
    </div>
  )
}

/* =========================================================
   PROOF STEP
========================================================= */

function ProofStep({
  method,
  orderId,
  total,
  file,
  onFileChange,
  onSubmit,
  submitting,
}: {
  method: PaymentMethod
  orderId: string
  total: number
  file: File | null
  onFileChange: (
    f: File | null
  ) => void
  onSubmit: (
    e: React.FormEvent
  ) => void
  submitting: boolean
}) {
  const config =
    STORE_CONFIG.payments[method]

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="font-body font-semibold text-white text-lg mb-1">
          Upload Payment Proof
        </h2>

        <p className="text-sm text-[var(--text-secondary)]">
          Upload your screenshot below.
        </p>
      </div>

      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
        <div className="flex justify-between">
          <span>Amount</span>

          <span>
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mt-2">
          <span>Sent To</span>

          <span className="font-mono">
            {config.handle}
          </span>
        </div>

        <div className="flex justify-between mt-2">
          <span>Order ID</span>

          <span className="font-mono text-xs">
            {orderId}
          </span>
        </div>
      </div>

      <div>
        <label className="label">
          Screenshot
        </label>

        <div className="relative border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onFileChange(
                e.target.files?.[0] ?? null
              )
            }
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {file ? (
            <div>
              <Check
                size={24}
                className="text-green-400 mx-auto mb-2"
              />

              <p className="text-green-400 text-sm">
                {file.name}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">
                📸
              </div>

              <p className="text-sm text-[var(--text-secondary)]">
                Upload screenshot
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full"
      >
        {submitting
          ? 'Placing Order...'
          : 'Place Order'}
      </button>
    </motion.form>
  )
}

/* =========================================================
   ORDER SUMMARY
========================================================= */

function OrderSummary({
  items,
  sub,
  shipping,
  total,
}: {
  items: import('@/types').CartItem[]
  sub: number
  shipping: number
  total: number
}) {
  return (
    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5 h-fit sticky top-24">
      <h3 className="font-semibold text-white mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-[var(--surface-3)]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  FL
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs text-white">
                {item.title}
              </p>

              <p className="text-[10px] text-[var(--text-muted)]">
                {item.quantity} × $
                {item.price.toFixed(2)}
              </p>
            </div>

            <span className="text-xs text-white font-semibold">
              $
              {(
                item.price *
                item.quantity
              ).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>${sub.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>

          <span>
            {shipping === 0
              ? 'Free'
              : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-white font-semibold text-base border-t border-[var(--border)] pt-2">
          <span>Total</span>

          <span>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
