'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Truck, Phone } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  // Keep the public footer off the admin area
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-[#0f172a] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Link href="/inventory" className="flex items-center gap-2">
            <div className="bg-[#f59e0b] rounded p-1">
              <Truck className="w-3.5 h-3.5 text-[#0f172a]" />
            </div>
            <span className="text-white font-bold">
              Truck<span className="text-[#f59e0b]">Deal</span>
            </span>
          </Link>
          <span className="text-slate-600">·</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+15551234567" className="inline-flex items-center gap-1.5 hover:text-[#f59e0b] transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#f59e0b]" /> (555) 123-4567
          </a>
          <Link href="/admin" className="hover:text-[#f59e0b] transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
