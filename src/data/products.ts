import type { Product } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
//  FASTLANE APPAREL — PRODUCT CATALOG
//
//  HOW TO ADD PRODUCTS:
//  1. Copy an existing product block
//  2. Change the id, title, description, images, price, variants
//  3. Save the file — your site rebuilds automatically on Netlify
//
//  IMAGES: Put your images in /public/images/products/
//  Then reference them as "/images/products/your-image.jpg"
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // ── APPAREL ──────────────────────────────────────────────────────────────
  {
    id: 'fastlane-hoodie-black',
    title: 'Fastlane Hoodie',
    type: 'apparel',
    description: 'Heavyweight 400GSM fleece. Dropped shoulders, kangaroo pocket, ribbed cuffs. Built to outlast the hype.',
    images: [
      '/images/products/hoodie-black-1.jpg',
      '/images/products/hoodie-black-2.jpg',
      '/images/products/hoodie-black-3.jpg',
    ],
    basePrice: 65,
    salePrice: 55,
    tags: ['hoodie', 'fleece', 'heavyweight'],
    featured: true,
    variantOptions: [
      { label: 'Color', values: ['Black', 'Ash Grey'] },
      { label: 'Size', values: ['S', 'M', 'L', 'XL', '2XL'] },
    ],
    variants: [
      { id: 'fh-blk-s',  options: { Color: 'Black',    Size: 'S'   }, price: 65, inventory: 5  },
      { id: 'fh-blk-m',  options: { Color: 'Black',    Size: 'M'   }, price: 65, inventory: 12 },
      { id: 'fh-blk-l',  options: { Color: 'Black',    Size: 'L'   }, price: 65, inventory: 10 },
      { id: 'fh-blk-xl', options: { Color: 'Black',    Size: 'XL'  }, price: 65, inventory: 8  },
      { id: 'fh-blk-2x', options: { Color: 'Black',    Size: '2XL' }, price: 70, inventory: 3  },
      { id: 'fh-ash-s',  options: { Color: 'Ash Grey', Size: 'S'   }, price: 65, inventory: 4  },
      { id: 'fh-ash-m',  options: { Color: 'Ash Grey', Size: 'M'   }, price: 65, inventory: 9  },
      { id: 'fh-ash-l',  options: { Color: 'Ash Grey', Size: 'L'   }, price: 65, inventory: 7  },
      { id: 'fh-ash-xl', options: { Color: 'Ash Grey', Size: 'XL'  }, price: 65, inventory: 6  },
      { id: 'fh-ash-2x', options: { Color: 'Ash Grey', Size: '2XL' }, price: 70, inventory: 2  },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 'fastlane-tee-black',
    title: 'Fastlane Tee',
    type: 'apparel',
    description: '100% ringspun cotton. Oversized boxy cut. Screen-printed logo, never heat transfer. Wash cold, hang dry.',
    images: [
      '/images/products/tee-black-1.jpg',
      '/images/products/tee-black-2.jpg',
    ],
    basePrice: 35,
    tags: ['tshirt', 'cotton', 'oversized'],
    featured: true,
    variantOptions: [
      { label: 'Color', values: ['Black', 'White', 'Red'] },
      { label: 'Size', values: ['S', 'M', 'L', 'XL'] },
    ],
    variants: [
      { id: 'ft-blk-s',  options: { Color: 'Black', Size: 'S'  }, price: 35, inventory: 10 },
      { id: 'ft-blk-m',  options: { Color: 'Black', Size: 'M'  }, price: 35, inventory: 15 },
      { id: 'ft-blk-l',  options: { Color: 'Black', Size: 'L'  }, price: 35, inventory: 12 },
      { id: 'ft-blk-xl', options: { Color: 'Black', Size: 'XL' }, price: 35, inventory: 8  },
      { id: 'ft-wht-s',  options: { Color: 'White', Size: 'S'  }, price: 35, inventory: 6  },
      { id: 'ft-wht-m',  options: { Color: 'White', Size: 'M'  }, price: 35, inventory: 9  },
      { id: 'ft-wht-l',  options: { Color: 'White', Size: 'L'  }, price: 35, inventory: 7  },
      { id: 'ft-wht-xl', options: { Color: 'White', Size: 'XL' }, price: 35, inventory: 5  },
      { id: 'ft-red-s',  options: { Color: 'Red',   Size: 'S'  }, price: 35, inventory: 4  },
      { id: 'ft-red-m',  options: { Color: 'Red',   Size: 'M'  }, price: 35, inventory: 8  },
      { id: 'ft-red-l',  options: { Color: 'Red',   Size: 'L'  }, price: 35, inventory: 6  },
      { id: 'ft-red-xl', options: { Color: 'Red',   Size: 'XL' }, price: 35, inventory: 3  },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 'fastlane-cargo-pants',
    title: 'Cargo Pants',
    type: 'apparel',
    description: 'Utility cargo pants with side pockets and adjustable hem. Relaxed fit, structured waist.',
    images: [
      '/images/products/cargo-1.jpg',
    ],
    basePrice: 85,
    tags: ['pants', 'cargo', 'utility'],
    featured: false,
    variantOptions: [
      { label: 'Color', values: ['Black', 'Olive'] },
      { label: 'Size', values: ['S', 'M', 'L', 'XL'] },
    ],
    variants: [
      { id: 'cp-blk-s',  options: { Color: 'Black', Size: 'S'  }, price: 85, inventory: 5  },
      { id: 'cp-blk-m',  options: { Color: 'Black', Size: 'M'  }, price: 85, inventory: 8  },
      { id: 'cp-blk-l',  options: { Color: 'Black', Size: 'L'  }, price: 85, inventory: 6  },
      { id: 'cp-blk-xl', options: { Color: 'Black', Size: 'XL' }, price: 85, inventory: 4  },
      { id: 'cp-olv-s',  options: { Color: 'Olive', Size: 'S'  }, price: 85, inventory: 3  },
      { id: 'cp-olv-m',  options: { Color: 'Olive', Size: 'M'  }, price: 85, inventory: 6  },
      { id: 'cp-olv-l',  options: { Color: 'Olive', Size: 'L'  }, price: 85, inventory: 5  },
      { id: 'cp-olv-xl', options: { Color: 'Olive', Size: 'XL' }, price: 85, inventory: 2  },
    ],
    createdAt: '2024-01-15',
  },

  // ── POSTERS ──────────────────────────────────────────────────────────────
  {
    id: 'fastlane-poster-speed',
    title: 'Speed Poster',
    type: 'poster',
    description: 'Limited run art print. Archival inks on 100lb matte stock. Ships flat in protective tube.',
    images: [
      '/images/products/poster-speed-1.jpg',
      '/images/products/poster-speed-2.jpg',
    ],
    basePrice: 25,
    tags: ['poster', 'art', 'limited'],
    featured: true,
    variantOptions: [
      { label: 'Size', values: ['12×18', '18×24', '24×36'] },
      { label: 'Finish', values: ['Matte', 'Glossy'] },
    ],
    variants: [
      { id: 'ps-sm-m', options: { Size: '12×18', Finish: 'Matte'  }, price: 25, inventory: 20 },
      { id: 'ps-sm-g', options: { Size: '12×18', Finish: 'Glossy' }, price: 27, inventory: 20 },
      { id: 'ps-md-m', options: { Size: '18×24', Finish: 'Matte'  }, price: 35, inventory: 15 },
      { id: 'ps-md-g', options: { Size: '18×24', Finish: 'Glossy' }, price: 38, inventory: 15 },
      { id: 'ps-lg-m', options: { Size: '24×36', Finish: 'Matte'  }, price: 50, inventory: 10 },
      { id: 'ps-lg-g', options: { Size: '24×36', Finish: 'Glossy' }, price: 55, inventory: 10 },
    ],
    createdAt: '2024-02-01',
  },

  // ── PHONE CASES ──────────────────────────────────────────────────────────
  {
    id: 'fastlane-phone-case',
    title: 'Fastlane Phone Case',
    type: 'phone-case',
    description: 'Hard polycarbonate shell with matte coating. Precision cutouts. Slim profile, raised lip protection.',
    images: [
      '/images/products/case-1.jpg',
      '/images/products/case-2.jpg',
    ],
    basePrice: 28,
    tags: ['case', 'phone', 'accessories'],
    featured: false,
    variantOptions: [
      { label: 'Device', values: [
        'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
        'iPhone 16', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
        'Samsung S24', 'Samsung S24 Ultra', 'Samsung S25', 'Samsung S25 Ultra',
      ]},
      { label: 'Finish', values: ['Matte Black', 'Clear'] },
    ],
    variants: [
      { id: 'fpc-i15-mb',    options: { Device: 'iPhone 15',         Finish: 'Matte Black' }, price: 28, inventory: 10 },
      { id: 'fpc-i15-cl',    options: { Device: 'iPhone 15',         Finish: 'Clear'       }, price: 25, inventory: 10 },
      { id: 'fpc-i15p-mb',   options: { Device: 'iPhone 15 Pro',     Finish: 'Matte Black' }, price: 28, inventory: 10 },
      { id: 'fpc-i15p-cl',   options: { Device: 'iPhone 15 Pro',     Finish: 'Clear'       }, price: 25, inventory: 10 },
      { id: 'fpc-i15pm-mb',  options: { Device: 'iPhone 15 Pro Max', Finish: 'Matte Black' }, price: 30, inventory: 8  },
      { id: 'fpc-i15pm-cl',  options: { Device: 'iPhone 15 Pro Max', Finish: 'Clear'       }, price: 27, inventory: 8  },
      { id: 'fpc-i16-mb',    options: { Device: 'iPhone 16',         Finish: 'Matte Black' }, price: 28, inventory: 12 },
      { id: 'fpc-i16-cl',    options: { Device: 'iPhone 16',         Finish: 'Clear'       }, price: 25, inventory: 12 },
      { id: 'fpc-i16p-mb',   options: { Device: 'iPhone 16 Pro',     Finish: 'Matte Black' }, price: 28, inventory: 12 },
      { id: 'fpc-i16pm-mb',  options: { Device: 'iPhone 16 Pro Max', Finish: 'Matte Black' }, price: 30, inventory: 10 },
      { id: 'fpc-s24-mb',    options: { Device: 'Samsung S24',       Finish: 'Matte Black' }, price: 28, inventory: 8  },
      { id: 'fpc-s24u-mb',   options: { Device: 'Samsung S24 Ultra', Finish: 'Matte Black' }, price: 30, inventory: 8  },
      { id: 'fpc-s25-mb',    options: { Device: 'Samsung S25',       Finish: 'Matte Black' }, price: 28, inventory: 10 },
      { id: 'fpc-s25u-mb',   options: { Device: 'Samsung S25 Ultra', Finish: 'Matte Black' }, price: 30, inventory: 10 },
    ],
    createdAt: '2024-02-15',
  },

  // ── STICKERS ─────────────────────────────────────────────────────────────
  {
    id: 'fastlane-sticker-pack',
    title: 'Sticker Pack Vol.1',
    type: 'sticker',
    description: '5-pack of weatherproof vinyl stickers. UV-resistant ink. Stick anywhere.',
    images: [
      '/images/products/stickers-1.jpg',
    ],
    basePrice: 12,
    tags: ['stickers', 'vinyl', 'pack'],
    featured: false,
    variantOptions: [
      { label: 'Pack', values: ['Vol.1 — Logo Mix', 'Vol.2 — Racing Theme'] },
    ],
    variants: [
      { id: 'sp-v1', options: { Pack: 'Vol.1 — Logo Mix'    }, price: 12, inventory: 50 },
      { id: 'sp-v2', options: { Pack: 'Vol.2 — Racing Theme' }, price: 12, inventory: 50 },
    ],
    createdAt: '2024-03-01',
  },
]

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getProductsByType(type: string): Product[] {
  if (type === 'all') return PRODUCTS
  return PRODUCTS.filter(p => p.type === type)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured)
}

export function getProductTypes(): string[] {
  const types = [...new Set(PRODUCTS.map(p => p.type))]
  return ['all', ...types]
}

export function findVariant(product: Product, selectedOptions: Record<string, string>): ProductVariant | undefined {
  return product.variants.find(v =>
    Object.entries(selectedOptions).every(([key, val]) => v.options[key] === val)
  )
}

export function getDisplayPrice(product: Product): number {
  return product.salePrice ?? product.basePrice
}
