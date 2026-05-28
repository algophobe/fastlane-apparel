import { useEffect, useState } from 'react'

import type { Product } from '@/types'

const STORAGE_KEY = 'fastlane-products'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])

  const [title, setTitle] = useState('')
  const [type, setType] = useState('hoodies')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState('')
  const [price, setPrice] = useState('')
  const [optionName, setOptionName] = useState('')
  const [optionValues, setOptionValues] = useState('')

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY)

    if (saved) {
      setProducts(JSON.parse(saved))
    }
  }, [])

  function saveProducts(updated: Product[]) {
    setProducts(updated)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    )
  }

  function handleAddProduct(
    e: React.FormEvent
  ) {
    e.preventDefault()

    const values =
      optionValues
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)

    const basePrice = Number(price)

    const newProduct: Product = {
      id: crypto.randomUUID(),

      title,

      type,

      description,

      images: images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean),

      basePrice,

      tags: [],

      featured: false,

      variantOptions: optionName
        ? [
            {
              name: optionName,
              values,
            },
          ]
        : [],

      variants:
        values.length > 0
          ? values.map((value) => ({
              id: crypto.randomUUID(),

              options: {
                [optionName]: value,
              },

              price: basePrice,

              inventory: 999,
            }))
          : [
              {
                id: crypto.randomUUID(),
                options: {},
                price: basePrice,
                inventory: 999,
              },
            ],

      createdAt: new Date().toISOString(),
    }

    const updated = [newProduct, ...products]

    saveProducts(updated)

    setTitle('')
    setDescription('')
    setImages('')
    setPrice('')
    setOptionName('')
    setOptionValues('')
  }

  function deleteProduct(id: string) {
    const updated = products.filter(
      (product) => product.id !== id
    )

    saveProducts(updated)
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3">
            Admin Dashboard
          </h1>

          <p className="text-white/60">
            Add and manage products instantly.
          </p>
        </div>

        {/* ADD PRODUCT */}
        <form
          onSubmit={handleAddProduct}
          className="bg-[#111] border border-white/10 rounded-3xl p-8 mb-12 space-y-5"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Add Product
          </h2>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Product Title"
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
          />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
          >
            <option value="hoodies">
              Hoodies
            </option>

            <option value="t-shirts">
              T-Shirts
            </option>

            <option value="posters">
              Posters
            </option>

            <option value="cases">
              Cases
            </option>
          </select>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Description"
            className="w-full h-32 bg-black border border-white/10 rounded-xl px-4 py-3"
          />

          <input
            value={images}
            onChange={(e) =>
              setImages(e.target.value)
            }
            placeholder="Image URLs (comma separated)"
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
          />

          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Base Price"
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={optionName}
              onChange={(e) =>
                setOptionName(e.target.value)
              }
              placeholder="Option Name (Size, MagSafe, Finish)"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
            />

            <input
              value={optionValues}
              onChange={(e) =>
                setOptionValues(
                  e.target.value
                )
              }
              placeholder="Option Values (S,M,L)"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="bg-[#F5C542] text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200"
          >
            Add Product
          </button>
        </form>

        {/* PRODUCTS */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    {product.title}
                  </h3>

                  <p className="text-white/50 text-sm capitalize">
                    {product.type}
                  </p>

                  <p className="text-[#F5C542] font-bold mt-1">
                    ${product.basePrice}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  deleteProduct(product.id)
                }
                className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
