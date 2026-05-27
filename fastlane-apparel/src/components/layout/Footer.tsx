import { Link } from 'react-router-dom'
import { STORE_CONFIG } from '@/data/config'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-display text-2xl tracking-widest text-white mb-2">FASTLANE</div>
            <p className="text-[var(--text-muted)] text-sm font-body">{STORE_CONFIG.tagline}</p>
          </div>

          <div className="flex gap-8 text-sm text-[var(--text-secondary)] font-body">
            <Link to="/" className="hover:text-white transition-colors">Shop</Link>
            <a href={STORE_CONFIG.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href={`mailto:${STORE_CONFIG.email}`} className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[var(--text-muted)] text-xs font-body">
            © {new Date().getFullYear()} Fastlane Apparel. All rights reserved.
          </p>
          <p className="text-[var(--text-muted)] text-xs font-mono">
            Payments via Cash App · Venmo · Zelle
          </p>
        </div>
      </div>
    </footer>
  )
}
