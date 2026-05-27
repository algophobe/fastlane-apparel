# Fastlane Apparel — Storefront

Premium streetwear storefront built with Vite + React + Tailwind. Deploys as a static site to Netlify.

---

## 📁 Where Files Go

```
fastlane-apparel/
│
├── public/                          ← Static files served as-is
│   ├── favicon.svg
│   └── images/
│       └── products/                ← YOUR PRODUCT IMAGES GO HERE
│           ├── hoodie-black-1.jpg
│           └── ...
│
├── src/
│   ├── data/
│   │   ├── products.ts              ← ✏️  EDIT THIS to add/remove products
│   │   └── config.ts                ← ✏️  EDIT THIS for payment handles, brand info
│   │
│   ├── pages/
│   │   ├── StorePage.tsx            ← Main shop page
│   │   ├── ProductPage.tsx          ← Individual product page
│   │   ├── CheckoutPage.tsx         ← Checkout flow
│   │   ├── OrderConfirmPage.tsx     ← Order confirmation
│   │   └── AdminPage.tsx            ← Admin dashboard (/admin)
│   │
│   ├── components/
│   │   ├── layout/                  ← Navbar, Footer, Layout wrapper
│   │   ├── product/                 ← ProductCard, ProductGrid, VariantSelector, ImageGallery
│   │   └── cart/                    ← CartDrawer
│   │
│   ├── hooks/
│   │   ├── useStore.ts              ← Cart + Orders state (Zustand + localStorage)
│   │   └── nanoid.ts                ← ID generator
│   │
│   └── types/index.ts               ← All TypeScript types
│
├── netlify.toml                     ← Netlify config (SPA routing + build settings)
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🚀 First-Time Setup (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:5173
```

---

## 🌐 Deploy to Netlify

### Option A — Drag & Drop (Simplest)

```bash
# Build the site
npm run build

# This creates a /dist folder
# Go to app.netlify.com → "Add new site" → "Deploy manually"
# Drag the /dist folder into the Netlify UI
# Done. Your site is live.
```

### Option B — Auto-deploy from GitHub (Recommended for ongoing updates)

1. Push this folder to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com) → New site from Git
3. Connect GitHub → select your repo
4. Netlify auto-detects the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy** — every `git push` auto-redeploys

---

## 🔗 Connect Your Existing Domain

### If your main site is on Framer at `fastlaneapparel.com`:

Option 1 — Run the shop on a **subdomain** (recommended):
```
shop.fastlaneapparel.com → Netlify
fastlaneapparel.com      → Framer (unchanged)
```

In Netlify: Site settings → Domain management → Add custom domain → `shop.fastlaneapparel.com`

Then in your DNS (wherever your domain is registered):
```
CNAME  shop  →  your-site-name.netlify.app
```

Option 2 — Run the shop on a **path** using Framer's embed:
- Not recommended — use the subdomain approach instead for full control

### Linking from your Framer site:
Add a button/link anywhere in Framer pointing to `https://shop.fastlaneapparel.com`

---

## ✏️ How to Update Products

All products live in ONE file: `src/data/products.ts`

### Add a new product:
```ts
// Copy this template and add it to the PRODUCTS array
{
  id: 'my-new-product',           // unique, URL-safe ID
  title: 'My New Product',
  type: 'apparel',                // apparel | poster | phone-case | accessory | sticker
  description: 'Product description here.',
  images: [
    '/images/products/my-product-1.jpg',
  ],
  basePrice: 40,
  salePrice: 30,                  // optional — remove if no sale
  tags: ['hoodie', 'new'],
  featured: true,                 // shows in featured section
  variantOptions: [
    { label: 'Size', values: ['S', 'M', 'L', 'XL'] },
    { label: 'Color', values: ['Black', 'White'] },
  ],
  variants: [
    { id: 'mnp-blk-s', options: { Size: 'S', Color: 'Black' }, price: 40, inventory: 10 },
    { id: 'mnp-blk-m', options: { Size: 'M', Color: 'Black' }, price: 40, inventory: 15 },
    // ... one row per combination
  ],
  createdAt: '2024-03-01',
},
```

### Add product images:
1. Drop image files in `/public/images/products/`
2. Reference as `/images/products/your-image.jpg` in products.ts
3. Rebuild + redeploy

### Update payment handles:
Edit `src/data/config.ts` — change the `payments` section.

---

## 🛍️ How the Store Works

### Customer Flow:
1. Browse products at `/` or `/shop`
2. Click product → `/product/:id` (full page with variants)
3. Select size/color/etc → Add to Cart
4. Cart slide-out appears
5. Go to `/checkout`
6. Fill in shipping info → pick Cash App / Venmo / Zelle → upload screenshot
7. Order saved → confirmation page at `/order/:id`

### Admin Flow:
1. Go to `/admin`
2. See all orders + stats
3. Click order to expand → view screenshot → verify payment
4. Mark as Shipped → Completed

### Data Storage:
- **Cart**: Saved in browser localStorage (`fastlane-cart`)
- **Orders**: Saved in browser localStorage (`fastlane-orders`)
- **No server required** — everything runs client-side

> ⚠️ Orders are per-device/browser. If you clear localStorage, orders disappear.
> For production, consider adding Supabase as a backend (see upgrade path below).

---

## 🔧 Routing Reference

| Route | Page |
|-------|------|
| `/` | Shop (product grid) |
| `/shop` | Same as `/` |
| `/product/:id` | Product detail page |
| `/checkout` | Checkout flow |
| `/order/:id` | Order confirmation |
| `/admin` | Admin dashboard |

The `netlify.toml` includes `/* → /index.html` redirect so all routes work correctly on Netlify.

---

## 🎨 Customization

### Colors & Brand:
Edit `tailwind.config.js` → `colors` section. The main accent is `--brand-red: #FF2D1B`.

### Fonts:
Edit `index.html` (Google Fonts link) + `tailwind.config.js` `fontFamily` section.
Current fonts: **Bebas Neue** (display/headings), **DM Sans** (body), **JetBrains Mono** (labels/code).

### Add a new product type:
Just use a new `type` string in products.ts — the system handles it automatically. No code changes needed.

---

## 📦 Future Upgrades

### Add a real backend (Supabase):
When you're ready to persist orders server-side, add Supabase:
```bash
npm install @supabase/supabase-js
```
Then update `useStore.ts` to write orders to Supabase instead of (or in addition to) localStorage.

### Add Stripe payments later:
The checkout flow is designed to be payment-method-agnostic. Add a Stripe card as a 4th payment option alongside Cash App/Venmo/Zelle.

### Email notifications (Resend):
Add a Netlify serverless function at `netlify/functions/send-email.ts` using the Resend API.

---

## 🛠️ Scripts

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Build for production → /dist
npm run preview   # Preview the /dist build locally
```
