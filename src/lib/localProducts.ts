import type { Product } from '@/types'

const STORAGE_KEY = 'fastlane-products'

export function getProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEY)

  if (!data) return []

  return JSON.parse(data)
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products)
  )
}

export function addProduct(product: Product) {
  const products = getProducts()

  products.unshift(product)

  saveProducts(products)
}
