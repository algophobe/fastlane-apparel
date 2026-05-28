/// <reference types="vite/client" />

import type { Product } from '@/types'

const SHEET_ID = '10PJCI4QTy6OpH9pq1snAGANMno9BxC5s9r3HEsqWrOw'

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY

const RANGE = 'Sheet1!A2:H'

export async function fetchProducts(): Promise<Product[]> {
  try {
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`

    const res = await fetch(url)

    const data = await res.json()

    const rows = data.values || []

    return rows.map((row: string[], index: number) => {
  const optionName = row[4] || 'Option'

  const optionValues =
    row[5]
      ?.split(',')
      .map((v) => v.trim()) || []

  const basePrice = Number(row[6]) || 0

  const overrides: Record<string, number> = {}

  if (row[7]) {
    row[7].split(',').forEach((pair) => {
      const [option, price] = pair.split(':')

      overrides[option.trim()] = Number(price)
    })
  }

  return {
    id:
      row[0]
        ?.toLowerCase()
        .replace(/\s+/g, '-') + '-' + index,

    title: row[0] || 'Untitled',

    type: row[1]?.trim().toLowerCase() || 'hoodies',

    images:
  row[2]
    ?.split(',')
    .map((img) => img.trim()) || [],

    description: row[3] || '',

    basePrice,

    tags: [],

    featured: false,

    variantOptions: [
      {
        name: optionName,
        values: optionValues,
      },
    ],

    variants: optionValues.map((value) => ({
      id: `${index}-${value}`,

      options: {
        [optionName]: value,
      },

      price:
        overrides[value] || basePrice,

      inventory: 999,
    })),

    createdAt: new Date().toISOString(),
  }
})
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return []
  }
}
