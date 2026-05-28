/// <reference types="vite/client" />

import type { Product } from '@/types'

const SHEET_ID = '10PJCI4QTy6OpH9pq1snAGANMno9BxC5s9r3HEsqWrOw'

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY

const RANGE = 'Sheet1!A2:F'

export async function fetchProducts(): Promise<Product[]> {
  try {
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`

    const res = await fetch(url)

    const data = await res.json()

    const rows = data.values || []

    return rows.map((row: string[], index: number) => ({
      id:
        row[0]
          ?.toLowerCase()
          .replace(/\s+/g, '-') + '-' + index,

      title: row[0] || 'Untitled',

      type: row[2] || 'hoodies',

      description: row[4] || '',

      images: [row[3]],

      basePrice: Number(row[1]) || 0,

      tags: [],

      featured: row[5] === 'true',

      variantOptions: [],

      variants: [
        {
          id: `variant-${index}`,
          options: {},
          price: Number(row[1]) || 0,
          inventory: 999,
        },
      ],

      createdAt: new Date().toISOString(),
    }))
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return []
  }
}
