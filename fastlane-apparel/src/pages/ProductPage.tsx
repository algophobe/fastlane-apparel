import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react'
import { getProductById, findVariant, getDisplayPrice } from '@/data/products'
import ImageGallery from '@/components/product/ImageGallery'
import VariantSelector from '@/components/product/VariantSelector'
import { useCartStore } from '@/hooks/useStore'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = id ? getProductById(id) : undefined
  const addItem = useCartStore(s => s.addItem)

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  // Initialize first available option for each variant dimension
  useEffect(() => {
    if (!product) return
    const initial: Record<string, string> = {}
    for (const opt of product.variantOptions) {
      initial[opt.label] = opt.values[0]
    }
    setSelectedOptions(initial)
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-6xl text-white/10 mb-4">404</div>
          <p className="text-[var(--text-secondary)] font-body mb-6">Product not found</p>
          <button onClick={() => navigate('/')} className="btn-ghost">← Back to Shop</button>
        </div>
      </div>
    )
  }

  const selectedVariant = findVariant(product, selectedOptions)
  const allOptionsSelected = product.variantOptions.every(opt => selectedOptions[opt.label])
  const displayPrice = selectedVariant?.price ?? getDisplayPrice(product)
  const inStock = !selectedVariant || selectedVariant.inventory > 0
  const canAdd = allOptionsSelected && inStock

  const handleAddToCart = () => {
    if (!canAdd || !selectedVariant) return

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      image: selectedVariant.image ?? product.images[0] ?? '',
      selectedOptions,
      price: displayPrice,
      quantity,
    })
    toast.success(`${product.title} added to cart`)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors text-sm font-body mb-8"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageGallery images={product.images} title={product.title} />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24 self-start space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  {product.type}
                </span>
                {product.salePrice && <span className="badge-sale">SALE</span>}
              </div>
              <h1 className="font-display text-4xl md:text-5xl tracking-wide text-white mb-3">
                {product.title.toUpperCase()}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-body font-semibold text-white">
                  ${displayPrice}
                </span>
                {product.salePrice && (
                  <span className="text-xl font-body text-[var(--text-muted)] line-through">
                    ${product.basePrice}
                  </span>
                )}
              </div>
            </div>

            <div className="divider" />

            {/* Variants */}
            <VariantSelector
              product={product}
              selected={selectedOptions}
              onChange={setSelectedOptions}
            />

            <div className="divider" />

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-3 bg-[var(--surface-3)] rounded-full px-2 py-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-5)] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-mono text-white w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface-5)] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                {!allOptionsSelected
                  ? 'Select Options'
                  : !inStock
                    ? 'Out of Stock'
                    : 'Add to Cart'
                }
              </button>
            </div>

            {/* Description */}
            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5">
              <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
                {product.description}
              </p>
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Payment methods */}
            <p className="text-xs text-[var(--text-muted)] font-body text-center">
              Pay via Cash App · Venmo · Zelle at checkout
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
