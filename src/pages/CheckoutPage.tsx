import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

import {
  useCartStore,
  useOrdersStore,
  generateOrderId,
} from '@/hooks/useStore'

import { STORE_CONFIG } from '@/data/config'

import type {
  CustomerInfo,
  PaymentMethod,
  Order,
} from '@/types'

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

  const { items, subtotal, clearCart } =
    useCartStore()

  const { addOrder } = useOrdersStore()

  const [step, setStep] =
    useState<Step>('info')

  const [customer, setCustomer] =
    useState<CustomerInfo>(EMPTY_CUSTOMER)

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null)

  const [proofFile, setProofFile] =
    useState<File | null>(null)

  const [submitting, setSubmitting] =
    useState(false)

  const [orderId] = useState(() =>
    generateOrderId()
  )

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

  const handleInfoSubmit = (
    e: React.FormEvent
  ) => {
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
      let screenshotData:
        | string
        | undefined

      if (proofFile) {
        screenshotData =
          await new Promise<string>(
            (resolve) => {
              const reader =
                new FileReader()

              reader.onload = () => {
                resolve(
                  reader.result as string
                )
              }

              reader.readAsDataURL(
                proofFile
              )
            }
          )
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

        paymentScreenshot:
          screenshotData,

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      }

      addOrder(order)

      // DISCORD WEBHOOK

      const formData = new FormData()

      formData.append(
        'payload_json',
        JSON.stringify({
          embeds: [
            {
              title: '🛒 New Order',
              color: 0xffffff,

              image: proofFile
                ? {
                    url:
                      'attachment://proof.png',
                  }
                : undefined,

              fields: [
                {
                  name: 'Customer',
                  value: `${customer.firstName} ${customer.lastName}`,
                  inline: true,
                },
                {
                  name: 'Email',
                  value: customer.email,
                  inline: true,
                },
                {
                  name: 'Phone',
                  value:
                    customer.phone ||
                    'N/A',
                  inline: true,
                },
                {
                  name: 'Payment',
                  value:
                    paymentMethod,
                  inline: true,
                },
                {
                  name: 'Total',
                  value: `$${total.toFixed(
                    2
                  )}`,
                  inline: true,
                },
                {
                  name: 'Order ID',
                  value: orderId,
                },
                {
                  name: 'Address',
                  value:
                    `${customer.address}\n` +
                    `${customer.city}, ${customer.state} ${customer.zip}\n` +
                    `${customer.country}`,
                },
              ],
            },
          ],
        })
      )

      if (proofFile) {
        formData.append(
          'file',
          proofFile,
          'proof.png'
        )
      }

      await fetch(
        'PASTE_YOUR_WEBHOOK_HERE',
        {
          method: 'POST',
          body: formData,
        }
      )

      clearCart()

      toast.success(
        'Order placed successfully'
      )

      navigate(`/order/${orderId}`)
    } catch (err) {
      console.error(err)

      toast.error(
        'Failed to place order'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* HEADER */}

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() =>
                navigate(-1)
              }
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="font-display text-3xl tracking-widest text-white">
              CHECKOUT
            </h1>
          </div>

          {/* PROGRESS */}

          <div className="flex items-center gap-3 text-xs font-mono">
            {(
              [
                'info',
                'payment',
                'proof',
              ] as Step[]
            ).map((s, i) => {
              const current =
                [
                  'info',
                  'payment',
                  'proof',
                ].indexOf(step)

              const idx = [
                'info',
                'payment',
                'proof',
              ].indexOf(s)

              return (
                <div
                  key={s}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex items-center gap-1.5 ${
                      step === s
                        ? 'text-white'
                        : current > idx
                        ? 'text-green-400'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                        step === s
                          ? 'border-white bg-white text-black'
                          : current > idx
                          ? 'border-green-400 bg-green-400 text-black'
                          : 'border-current'
                      }`}
                    >
                      {i + 1}
                    </span>

                    {s === 'info'
                      ? 'Info'
                      : s ===
                        'payment'
                      ? 'Payment'
                      : 'Proof'}
                  </div>

                  {i < 2 && (
                    <span className="text-[var(--text-muted)]">
                      ›
                    </span>
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
                onChange={
                  setCustomer
                }
                onSubmit={
                  handleInfoSubmit
                }
              />
            )}

            {step ===
              'payment' && (
              <PaymentStep
                onSelect={
                  handlePaymentSelect
                }
                orderId={orderId}
                total={total}
              />
            )}

            {step === 'proof' &&
              paymentMethod && (
                <ProofStep
                  method={
                    paymentMethod
                  }
                  orderId={
                    orderId
                  }
                  total={total}
                  file={proofFile}
                  onFileChange={
                    setProofFile
                  }
                  onSubmit={
                    handleProofSubmit
                  }
                  submitting={
                    submitting
                  }
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

/* ========================================================= */
/* INFO STEP */
/* ========================================================= */

function InfoStep({
  customer,
  onChange,
  onSubmit,
}: {
  customer: CustomerInfo
  onChange: (
    c: CustomerInfo
  ) => void
  onSubmit: (
    e: React.FormEvent
  ) => void
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
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="font-body font-semibold text-white text-lg mb-4">
          Contact
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="First Name"
            required
            value={
              customer.firstName
            }
            onChange={set(
              'firstName'
            )}
          />

          <input
            className="input"
            placeholder="Last Name"
            required
            value={
              customer.lastName
            }
            onChange={set(
              'lastName'
            )}
          />
        </div>

        <input
          className="input mt-3"
          type="email"
          placeholder="Email"
          required
          value={customer.email}
          onChange={set('email')}
        />

        <input
          className="input mt-3"
          placeholder="Phone"
          value={
            customer.phone ?? ''
          }
          onChange={set('phone')}
        />
      </div>

      <div>
        <h2 className="font-body font-semibold text-white text-lg mb-4">
          Shipping Address
        </h2>

        <div className="space-y-3">
          <input
            className="input"
            placeholder="Address"
            required
            value={
              customer.address
            }
            onChange={set(
              'address'
            )}
          />

          <input
            className="input"
            placeholder="Apartment / Suite"
            value={
              customer.address2 ??
              ''
            }
            onChange={set(
              'address2'
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="City"
              required
              value={
                customer.city
              }
              onChange={set(
                'city'
              )}
            />

            <input
              className="input"
              placeholder="State"
              required
              value={
                customer.state
              }
              onChange={set(
                'state'
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="ZIP"
              required
              value={
                customer.zip
              }
              onChange={set(
                'zip'
              )}
            />

            <select
              className="input"
              value={
                customer.country
              }
              onChange={set(
                'country'
              )}
            >
              <option value="US">
                United States
              </option>

              <option value="CA">
                Canada
              </option>

              <option value="GB">
                United Kingdom
              </option>
            </select>
          </div>

          <textarea
            className="input resize-none h-24"
            placeholder="Order notes..."
            value={
              customer.orderNotes ??
              ''
            }
            onChange={set(
              'orderNotes'
            )}
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
