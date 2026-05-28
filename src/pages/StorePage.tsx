import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { fetchProducts } from '@/lib/products'

import type { Product } from '@/types'

import ProductGrid from '@/components/product/ProductGrid'

export default function StorePage() {
  const [activeType, setActiveType] = useState('all')

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  const types = [
    'all',
    'hoodies',
    't-shirts',
    'posters',
    'cases',
  ]

  const typeLabels: Record<string, string> = {
    all: 'All',
    hoodies: 'Hoodies',
    't-shirts': 'T-Shirts',
    posters: 'Posters',
    cases: 'Cases',
  }

  const filteredProducts =
    activeType === 'all'
      ? products
      : products.filter(
          (product) => product.type === activeType
        )

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0000] via-surface-0 to-surface-0" />

        <div className="absolute inset-0 bg-gradient-radial from-[var(--brand-red)]/5 via-transparent to-transparent" />

        <div className="absolute top-20 left-0 right-0 overflow-hidden pointer-events-none">
          <div className="font-display text-[20vw] leading-none tracking-widest text-white/[0.03] whitespace-nowrap select-none px-4">
            FASTLANE
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className="font-mono text-[var(--brand-red)] text-xs tracking-[0.3em] uppercase mb-4">
              New Collection
            </p>

            <h1 className="font-display text-7xl md:text-9xl tracking-widest text-white leading-none mb-6">
              FASTLANE
              <br />

              <span className="text-[var(--brand-red)]">
                APPAREL
              </span>
            </h1>

            <p className="font-body text-[var(--text-secondary)] text-lg max-w-md">
              Built for the fast lane. Premium streetwear
              that moves with you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-2 flex-wrap mb-10 pb-6 border-b border-[var(--border)]">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                activeType === type
                  ? 'bg-white text-black'
                  : 'text-[var(--text-secondary)] hover:text-white border border-[var(--border)] hover:border-white/20'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>

        <ProductGrid products={filteredProducts} />
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl tracking-widest text-white mb-2">
              PAY YOUR WAY
            </h2>

            <p className="text-[var(--text-secondary)] font-body">
              Cash App · Venmo · Zelle — no account
              required
            </p>
          </div>

          <div className="flex items-center gap-3">
            {['Cash App', 'Venmo', 'Zelle'].map(
              (payment) => (
                <span
                  key={payment}
                  className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-3)] border border-[var(--border)] px-3 py-1.5 rounded-full"
                >
                  {payment}
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
