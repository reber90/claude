'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Truck } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // The admin area has its own chrome, so keep the public header off it
  if (pathname.startsWith('/admin')) return null

  const navLink = (href: string, label: string) => {
    const active = pathname === href || (href === '/inventory' && pathname.startsWith('/inventory'))
    return (
      <Link
        href={href}
        onClick={() => setMenuOpen(false)}
        className={`transition-colors text-sm font-medium ${active ? 'text-[#f59e0b]' : 'text-slate-300 hover:text-[#f59e0b]'}`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="bg-[#0f172a] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo goes to the main page */}
          <Link href="/inventory" className="flex items-center gap-2 group">
            <div className="bg-[#f59e0b] rounded-lg p-1.5">
              <Truck className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              Truck<span className="text-[#f59e0b]">Deal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLink('/inventory', 'Inventory')}
            {navLink('/contact', 'Contact')}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-slate-700">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLink('/inventory', 'Inventory')}
            {navLink('/contact', 'Contact')}
          </div>
        </div>
      )}
    </header>
  )
}
