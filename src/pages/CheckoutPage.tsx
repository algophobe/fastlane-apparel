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
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
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

  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)

    setStep('proof')
    window.scrollTo(0, 0)
  }

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentMethod) return

    setSubmitting(true)

    try {
      let screenshotData: string | undefined

      if (proofFile) {
        screenshotData = await new Promise<string>((resolve) => {
          const reader = new FileReader()

          reader.onload = () => {
            resolve(reader.result as string)
          }

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
await fetch('https://discord.com/api/webhooks/1509346199855955988/LmdG92xT8yZlzPnvP5NutSA2vI9koI6NivhwshuJtgjwni2FUbmzJv6ECC3VK_9wUxmb', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    embeds: [
      {
        title: '🛒 New Order',
        color: 0xffffff,
        fields: [
          {
            name: 'Order ID',
            value: orderId,
            inline: true,
          },
          {
            name: 'Customer',
            value: `${customer.firstName} ${customer.lastName}`,
            inline: true,
          },
          {
            name: 'Email',
            value: customer.email,
            inline: false,
          },
          {
            name: 'Payment Method',
            value: paymentMethod,
            inline: true,
          },
          {
            name: 'Total',
            value: `$${total.toFixed(2)}`,
            inline: true,
          },
          {
            name: 'Shipping Address',
            value: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }),
})
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

          {/* Progress */}
          <div className="flex items-center gap-3 text-xs font-mono">
            {(['info', 'payment', 'proof'] as Step[]).map((s, i) => {
              const currentIndex = ['info', 'payment', 'proof'].indexOf(step)
              const stepIndex = ['info', 'payment', 'proof'].indexOf(s)

              return (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-1.5 ${
                      step === s
                        ? 'text-white'
                        : currentIndex > stepIndex
                        ? 'text-green-400'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                        step === s
                          ? 'border-white bg-white text-black'
                          : currentIndex > stepIndex
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
                    <span className="text-[var(--text-muted)]">›</span>
                  )}
                </div>
              )
            })}
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

            {step === 'proof' && paymentMethod && (
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

/* INFO STEP */

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
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      onChange({
        ...customer,
        [k]: e.target.value,
      })
    }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      {/* CONTACT */}
      <div>
        <h2 className="font-body font-semibold text-white text-lg mb-4">
          Contact
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First Name</label>

            <input
              className="input"
              required
              value={customer.firstName}
              onChange={set('firstName')}
              placeholder="Jordan"
            />
          </div>

          <div>
            <label className="label">Last Name</label>

            <input
              className="input"
              required
              value={customer.lastName}
              onChange={set('lastName')}
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="label">Email</label>

          <input
            className="input"
            type="email"
            required
            value={customer.email}
            onChange={set('email')}
            placeholder="jordan@example.com"
          />
        </div>

        <div className="mt-3">
          <label className="label">Phone</label>

          <input
            className="input"
            type="tel"
            value={customer.phone ?? ''}
            onChange={set('phone')}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* SHIPPING */}
      <div>
        <h2 className="font-body font-semibold text-white text-lg mb-4">
          Shipping Address
        </h2>

        <div className="space-y-3">
          <div>
            <label className="label">Address</label>

            <input
              className="input"
              required
              value={customer.address}
              onChange={set('address')}
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="label">Apartment / Suite</label>

            <input
              className="input"
              value={customer.address2 ?? ''}
              onChange={set('address2')}
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">City</label>

              <input
                className="input"
                required
                value={customer.city}
                onChange={set('city')}
                placeholder="Los Angeles"
              />
            </div>

            <div>
              <label className="label">State</label>

              <input
                className="input"
                required
                value={customer.state}
                onChange={set('state')}
                placeholder="CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">ZIP</label>

              <input
                className="input"
                required
                value={customer.zip}
                onChange={set('zip')}
                placeholder="90001"
              />
            </div>

            <div>
              <label className="label">Country</label>

              <select
                className="input"
                value={customer.country}
                onChange={set('country')}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Order Notes</label>

            <textarea
              className="input resize-none h-20"
              value={customer.orderNotes ?? ''}
              onChange={set('orderNotes')}
              placeholder="Any special requests..."
            />
          </div>
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

/* PAYMENT STEP */

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
      handle: STORE_CONFIG.payments.cashapp.handle,
      color: STORE_CONFIG.payments.cashapp.color,
      icon: '💸',
      instructions: STORE_CONFIG.payments.cashapp.instructions,
    },
    {
      id: 'venmo' as PaymentMethod,
      name: 'Venmo',
      handle: STORE_CONFIG.payments.venmo.handle,
      color: STORE_CONFIG.payments.venmo.color,
      icon: '🔵',
      instructions: STORE_CONFIG.payments.venmo.instructions,
    },
    {
      id: 'zelle' as PaymentMethod,
      name: 'Zelle',
      handle: STORE_CONFIG.payments.zelle.handle,
      color: STORE_CONFIG.payments.zelle.color,
      icon: '🟣',
      instructions: STORE_CONFIG.payments.zelle.instructions,
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

        <p className="text-sm text-[var(--text-secondary)] font-body mt-1">
          Send{' '}
          <span className="text-white font-semibold">
            ${total.toFixed(2)}
          </span>{' '}
          to one of these methods, then upload your screenshot.
        </p>
      </div>

      {methods.map((method) => (
        <PaymentCard
          key={method.id}
          method={method}
          orderId={orderId}
          onSelect={() => onSelect(method.id)}
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
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(method.handle)

    setCopied(true)

    toast.success('Copied!')

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div
      className="relative border border-[var(--border)] rounded-2xl p-5 overflow-hidden"
      style={{
        background: `${method.color}08`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: method.color,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-body font-semibold text-white text-lg">
            {method.name}
          </div>

          <div
            className="font-mono text-sm mt-0.5"
            style={{
              color: method.color,
            }}
          >
            {method.handle}
          </div>
        </div>

        <span className="text-2xl">{method.icon}</span>
      </div>

      <div className="bg-black/30 rounded-xl p-3 mb-4">
        <p className="text-xs font-body text-[var(--text-secondary)]">
          {method.instructions}
        </p>

        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
          Order ID: {orderId}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-mono border border-[var(--border)] text-[var(--text-secondary)] hover:text-white px-3 py-2 rounded-lg transition-colors"
        >
          {copied ? (
            <Check
              size={13}
              className="text-green-400"
            />
          ) : (
            <Copy size={13} />
          )}

          Copy Handle
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex-1 text-xs font-body font-semibold rounded-lg px-3 py-2 transition-all hover:brightness-110"
          style={{
            background: method.color,
            color: '#000',
          }}
        >
          I Paid with {method.name} →
        </button>
      </div>
    </div>
  )
}

/* PROOF STEP */

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
  onFileChange: (f: File | null) => void
  onSubmit: (e: React.FormEvent) => void
  submitting: boolean
}) {
  const config = STORE_CONFIG.payments[method]

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

        <p className="text-sm text-[var(--text-secondary)] font-body">
          You selected{' '}
          <span className="text-white">
            {config.displayName}
          </span>{' '}
          — upload your payment screenshot below.
        </p>
      </div>

      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 text-sm font-body">
        <div className="flex justify-between text-[var(--text-secondary)]">
          <span>Amount sent</span>

          <span className="text-white font-semibold">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-[var(--text-secondary)] mt-1">
          <span>Sent to</span>

          <span className="text-white font-mono">
            {config.handle}
          </span>
        </div>

        <div className="flex justify-between text-[var(--text-secondary)] mt-1">
          <span>Order ID</span>

          <span className="text-white font-mono text-xs">
            {orderId}
          </span>
        </div>
      </div>

      <div>
        <label className="label">Payment Screenshot</label>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            file
              ? 'border-green-400/40 bg-green-400/5'
              : 'border-[var(--border)] hover:border-white/20'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onFileChange(e.target.files?.[0] ?? null)
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {file ? (
            <div>
              <Check
                size={24}
                className="text-green-400 mx-auto mb-2"
              />

              <p className="text-sm font-body text-green-400">
                {file.name}
              </p>

              <p className="text-xs text-[var(--text-muted)] mt-1">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">📸</div>

              <p className="text-sm font-body text-[var(--text-secondary)]">
                Drop screenshot here or tap to upload
              </p>

              <p className="text-xs text-[var(--text-muted)] mt-1">
                JPG, PNG, HEIC supported
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {submitting
          ? 'Placing Order…'
          : 'Place Order →'}
      </button>

      <p className="text-xs text-center text-[var(--text-muted)] font-body">
        You can also submit without a screenshot.
      </p>
    </motion.form>
  )
}

/* ORDER SUMMARY */

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
      <h3 className="font-body font-semibold text-white mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-[var(--surface-3)] flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-white/20">
                  FL
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-body text-white line-clamp-1">
                {item.title}
              </p>

              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                {Object.values(item.selectedOptions).join(
                  ' / '
                )}{' '}
                × {item.quantity}
              </p>
            </div>

            <span className="text-xs font-body text-white font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] pt-3 space-y-2 text-sm font-body">
        <div className="flex justify-between text-[var(--text-secondary)]">
          <span>Subtotal</span>
          <span>${sub.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-[var(--text-secondary)]">
          <span>Shipping</span>

          <span>
            {shipping === 0 ? (
              <span className="text-green-400">
                Free
              </span>
            ) : (
              `$${shipping}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-white font-semibold text-base border-t border-[var(--border)] pt-2">
          <span>Total</span>

          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
