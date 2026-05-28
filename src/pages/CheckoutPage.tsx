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
        <p>Your cart is empty</p>
      </div>
    )
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep('proof')
  }

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentMethod) return

    setSubmitting(true)

    try {
      const order: Order = {
        id: orderId,
        items,
        customer,
        paymentMethod,
        subtotal: sub,
        shipping,
        total,
        status: 'pending_verification',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const formData = new FormData()

      formData.append(
        'payload_json',
        JSON.stringify({
          embeds: [
            {
              title: '🛒 New Order',
              color: 0xffffff,
              fields: [
                {
                  name: 'Customer',
                  value: `${customer.firstName} ${customer.lastName}`,
                },
                {
                  name: 'Email',
                  value: customer.email,
                },
                {
                  name: 'Payment',
                  value: paymentMethod,
                },
                {
                  name: 'Total',
                  value: `$${total.toFixed(2)}`,
                },
              ],
            },
          ],
        })
      )

      if (proofFile) {
        formData.append('file', proofFile)
      }

      await fetch(import.meta.env.VITE_DISCORD_WEBHOOK, {
        method: 'POST',
        body: formData,
      })

      addOrder(order)

      clearCart()

      toast.success('Order placed')

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
      <div className="max-w-5xl mx-auto px-6">

        {step === 'info' && (
          <InfoStep
            customer={customer}
            onChange={setCustomer}
            onSubmit={handleInfoSubmit}
          />
        )}

        {step === 'payment' && (
          <PaymentStep
            total={total}
            orderId={orderId}
            onSelect={handlePaymentSelect}
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

        <OrderSummary
          items={items}
          sub={sub}
          shipping={shipping}
          total={total}
        />
      </div>
    </div>
  )
}

function InfoStep({
  customer,
  onChange,
  onSubmit,
}: any) {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="First Name"
        value={customer.firstName}
        onChange={(e) =>
          onChange({
            ...customer,
            firstName: e.target.value,
          })
        }
      />

      <input
        placeholder="Last Name"
        value={customer.lastName}
        onChange={(e) =>
          onChange({
            ...customer,
            lastName: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
        value={customer.email}
        onChange={(e) =>
          onChange({
            ...customer,
            email: e.target.value,
          })
        }
      />

      <button type="submit">
        Continue
      </button>
    </form>
  )
}

function PaymentStep({
  onSelect,
}: any) {
  return (
    <div className="space-y-4">
      <button onClick={() => onSelect('cashapp')}>
        Cash App
      </button>

      <button onClick={() => onSelect('venmo')}>
        Venmo
      </button>

      <button onClick={() => onSelect('zelle')}>
        Zelle
      </button>
    </div>
  )
}

function ProofStep({
  onSubmit,
  onFileChange,
  submitting,
}: any) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          onFileChange(e.target.files?.[0] || null)
        }
      />

      <button type="submit">
        {submitting ? 'Submitting...' : 'Place Order'}
      </button>
    </form>
  )
}

function OrderSummary({
  total,
}: any) {
  return (
    <div className="mt-10">
      <h2>Total: ${total.toFixed(2)}</h2>
    </div>
  )
}
