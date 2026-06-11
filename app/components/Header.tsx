'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Truck } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-[#0f172a] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#f59e0b] rounded-lg p-1.5">
              <Truck className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              Truck<span className="text-[#f59e0b]">Deal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-300 hover:text-[#f59e0b] transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/inventory" className="text-slate-300 hover:text-[#f59e0b] transition-colors text-sm font-medium">
              Inventory
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-[#f59e0b] transition-colors text-sm font-medium">
              Contact
            </Link>
            <Link
              href="/inventory"
              className="bg-[#f59e0b] text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
            >
              Browse Trucks
            </Link>
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
            <Link
              href="/"
              className="text-slate-300 hover:text-[#f59e0b] transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/inventory"
              className="text-slate-300 hover:text-[#f59e0b] transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Inventory
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-[#f59e0b] transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/inventory"
              className="bg-[#f59e0b] text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Browse Trucks
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
