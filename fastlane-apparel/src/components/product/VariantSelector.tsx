import type { Product, ProductVariant } from '@/types'
import { findVariant } from '@/data/products'

interface Props {
  product: Product
  selected: Record<string, string>
  onChange: (options: Record<string, string>) => void
}

export default function VariantSelector({ product, selected, onChange }: Props) {
  const handleSelect = (label: string, value: string) => {
    const updated = { ...selected, [label]: value }
    onChange(updated)
  }

  const isVariantAvailable = (label: string, value: string): boolean => {
    const testOptions = { ...selected, [label]: value }
    // Check if any variant matching these options has inventory
    const match = product.variants.find(v =>
      Object.entries(testOptions).every(([k, val]) => v.options[k] === val)
    )
    return match ? match.inventory > 0 : false
  }

  const selectedVariant: ProductVariant | undefined = findVariant(product, selected)

  return (
    <div className="space-y-5">
      {product.variantOptions.map(option => (
        <div key={option.label}>
          <div className="flex items-center justify-between mb-2">
            <span className="label mb-0">{option.label}</span>
            {selected[option.label] && (
              <span className="text-xs font-body text-[var(--text-secondary)]">
                {selected[option.label]}
                {/* Show price delta if applicable */}
                {selectedVariant && (
                  <PriceDelta variant={selectedVariant} basePrice={product.basePrice} />
                )}
              </span>
            )}
          </div>

          {/* Size-style buttons for Size/Device/Pack; swatch for Color */}
          {option.label === 'Color' ? (
            <ColorSwatches
              values={option.values}
              selected={selected[option.label]}
              onSelect={(v) => handleSelect(option.label, v)}
              isAvailable={(v) => isVariantAvailable(option.label, v)}
            />
          ) : (
            <SizeGrid
              values={option.values}
              selected={selected[option.label]}
              onSelect={(v) => handleSelect(option.label, v)}
              isAvailable={(v) => isVariantAvailable(option.label, v)}
              label={option.label}
            />
          )}
        </div>
      ))}

      {/* Inventory warning */}
      {selectedVariant && selectedVariant.inventory <= 3 && selectedVariant.inventory > 0 && (
        <p className="text-xs font-mono text-[var(--brand-red)]">
          Only {selectedVariant.inventory} left
        </p>
      )}
      {selectedVariant && selectedVariant.inventory === 0 && (
        <p className="text-xs font-mono text-[var(--text-muted)]">Out of stock</p>
      )}
    </div>
  )
}

function ColorSwatches({
  values, selected, onSelect, isAvailable,
}: {
  values: string[]
  selected?: string
  onSelect: (v: string) => void
  isAvailable: (v: string) => boolean
}) {
  // Map color names to CSS colors
  const colorMap: Record<string, string> = {
    Black: '#111111',
    White: '#FFFFFF',
    Red: '#FF2D1B',
    'Ash Grey': '#A0A0A0',
    Grey: '#808080',
    Olive: '#5B5B2F',
    Navy: '#1B2A4A',
    Blue: '#1D5FA6',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map(v => {
        const available = isAvailable(v)
        const isSelected = selected === v
        const cssColor = colorMap[v] ?? '#444444'

        return (
          <button
            key={v}
            onClick={() => available && onSelect(v)}
            disabled={!available}
            title={v}
            className={`
              relative w-8 h-8 rounded-full border-2 transition-all duration-150
              ${isSelected ? 'border-white scale-110' : 'border-transparent hover:border-white/40'}
              ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ background: cssColor }}
          >
            {!available && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-px bg-white/50 rotate-45 block" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function SizeGrid({
  values, selected, onSelect, isAvailable, label,
}: {
  values: string[]
  selected?: string
  onSelect: (v: string) => void
  isAvailable: (v: string) => boolean
  label: string
}) {
  // Use a dropdown for long lists (Device, etc.)
  const useDropdown = values.length > 8

  if (useDropdown) {
    return (
      <select
        value={selected ?? ''}
        onChange={e => onSelect(e.target.value)}
        className="input"
      >
        <option value="" disabled>Select {label}</option>
        {values.map(v => (
          <option key={v} value={v} disabled={!isAvailable(v)}>
            {v}{!isAvailable(v) ? ' — Out of Stock' : ''}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map(v => {
        const available = isAvailable(v)
        const isSelected = selected === v

        return (
          <button
            key={v}
            onClick={() => available && onSelect(v)}
            disabled={!available}
            className={`
              relative min-w-[44px] h-10 px-3 rounded-lg border text-xs font-mono font-medium
              transition-all duration-150
              ${isSelected
                ? 'bg-white text-black border-white'
                : available
                  ? 'bg-transparent text-white border-[var(--border-strong)] hover:border-white/30'
                  : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] cursor-not-allowed line-through'
              }
            `}
          >
            {v}
          </button>
        )
      })}
    </div>
  )
}

function PriceDelta({ variant, basePrice }: { variant: ProductVariant; basePrice: number }) {
  const diff = variant.price - basePrice
  if (diff === 0) return null
  return (
    <span className="text-[var(--text-muted)] ml-1">
      {diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`}
    </span>
  )
}
