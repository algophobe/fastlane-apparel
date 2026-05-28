import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProducts } from '@/lib/localProducts'

import type { Product } from '@/types'

import ProductGrid from '@/components/product/ProductGrid'

export default function StorePage() {
  const [activeType, setActiveType] = useState('all')

  const [products, setProducts] = useState<Product[]>([])

useEffect(() => {
  setProducts(getProducts())
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
    (product) =>
      product.type?.trim().toLowerCase() === activeType
  )

  return (
    <div>
      {/* TOP SPACING */}
<div className="h-28" />

{/* PAGE HEADER */}
<section className="max-w-7xl mx-auto px-6 mb-12">
  <div className="flex items-end justify-between gap-6 flex-wrap">
    <div>
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--brand-red)] font-mono mb-3">
        Fastlane Apparel
      </p>

      <h1 className="font-display text-5xl md:text-7xl tracking-widest text-white leading-none">
        SHOP
      </h1>
    </div>

    <p className="max-w-sm text-sm md:text-base text-[var(--text-secondary)] font-body">
      Premium streetwear inspired by speed,
      motion, and underground car culture.
    </p>
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
        Cash App · Venmo · Zelle — no account required
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
