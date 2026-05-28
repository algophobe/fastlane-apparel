import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '@/types'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const displayPrice =
  product.salePrice || product.basePrice
  const hasSale = !!product.salePrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[var(--surface-2)] rounded-2xl overflow-hidden mb-3">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <PlaceholderImage title={product.title} type={product.type} />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Sale badge */}
          {hasSale && (
            <div className="absolute top-3 left-3">
              <span className="badge-sale">SALE</span>
            </div>
          )}

          {/* Quick view pill */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="bg-white text-black text-xs font-body font-semibold px-4 py-2 rounded-full">
              Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-1">
          <h3 className="text-sm font-body font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-body font-semibold text-white">
              ${displayPrice}
            </span>
            {hasSale && (
              <span className="text-xs font-body text-[var(--text-muted)] line-through">
                ${product.basePrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function PlaceholderImage({ title, type }: { title: string; type: string }) {
  const colors: Record<string, string> = {
    apparel: '#1A1A1A',
    poster: '#111111',
    'phone-case': '#151515',
    accessory: '#121212',
    sticker: '#181818',
  }
  const bg = colors[type] ?? '#1A1A1A'

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3"
      style={{ background: bg }}
    >
      <div className="font-display text-4xl tracking-widest text-white/10">FL</div>
      <div className="text-[10px] font-mono text-white/20 text-center px-4 line-clamp-2">{title}</div>
    </div>
  )
}
