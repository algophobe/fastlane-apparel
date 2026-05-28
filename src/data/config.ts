// ─────────────────────────────────────────────────────────────────────────────
//  STORE CONFIGURATION
//  Edit this file to change your payment handles, brand info, shipping, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const STORE_CONFIG = {
  name: 'Fastlane Apparel',
  tagline: 'Built for the fast lane.',
  email: 'support.fastlaneapparel@gmail.com',

  // ── PAYMENT HANDLES ─────────────────────────────────────────────────────
  payments: {
    cashapp: {
      handle: '$fastlanepayment',
      displayName: 'Cash App',
      color: '#00D632',
      instructions: 'Send the exact total to $fastlanepayment and include your order ID in the note.',
    },
    venmo: {
      handle: '@fastlanepayment',
      displayName: 'Venmo',
      color: '#3D95CE',
      instructions: 'Send the exact total to @fastlanepayment. Add your order ID in the "What\'s it for?" field.',
    },
    zelle: {
      handle: '2015157846',
      displayName: 'Zelle',
      color: '#6D1ED4',
      instructions: 'Send to 2015157846 and text us your order ID after paying.',
    },
  },

  // ── SHIPPING ─────────────────────────────────────────────────────────────
  shipping: {
    freeThreshold: 0,      // free shipping on orders over $75
    flatRate: 0,          // flat rate below threshold
  },

  // ── SOCIAL ───────────────────────────────────────────────────────────────
  social: {
    instagram: 'https://www.instagram.com/fastlaneapparel.studio/',
  },
}
