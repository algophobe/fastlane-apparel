// ─────────────────────────────────────────────────────────────────────────────
//  STORE CONFIGURATION
//  Edit this file to change your payment handles, brand info, shipping, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const STORE_CONFIG = {
  name: 'Fastlane Apparel',
  tagline: 'Built for the fast lane.',
  email: 'orders@fastlaneapparel.com',

  // ── PAYMENT HANDLES ─────────────────────────────────────────────────────
  payments: {
    cashapp: {
      handle: '$FastlaneApparel',
      displayName: 'Cash App',
      color: '#00D632',
      instructions: 'Send the exact total to $FastlaneApparel and include your order ID in the note.',
    },
    venmo: {
      handle: '@FastlaneApparel',
      displayName: 'Venmo',
      color: '#3D95CE',
      instructions: 'Send the exact total to @FastlaneApparel. Add your order ID in the "What\'s it for?" field.',
    },
    zelle: {
      handle: 'payments@fastlaneapparel.com',
      displayName: 'Zelle',
      color: '#6D1ED4',
      instructions: 'Send to payments@fastlaneapparel.com and text us your order ID after paying.',
    },
  },

  // ── SHIPPING ─────────────────────────────────────────────────────────────
  shipping: {
    freeThreshold: 75,      // free shipping on orders over $75
    flatRate: 5.99,          // flat rate below threshold
  },

  // ── SOCIAL ───────────────────────────────────────────────────────────────
  social: {
    instagram: 'https://instagram.com/fastlaneapparel',
    twitter: 'https://twitter.com/fastlaneapparel',
  },
}
