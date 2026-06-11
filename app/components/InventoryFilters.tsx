'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface Props {
  makes: string[]
  current: {
    search?: string
    make?: string
    minPrice?: string
    maxPrice?: string
    year?: string
    condition?: string
  }
}

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Parts Only']
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i)

export default function InventoryFilters({ makes, current }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const next = { ...current, [key]: value }
      Object.entries(next).forEach(([k, v]) => {
        if (v) params.set(k, v)
      })
      if (!value) params.delete(key)
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [current, pathname, router]
  )

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasFilters = Object.values(current).some(Boolean)

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5 ${isPending ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search make, model, title…"
            defaultValue={current.search || ''}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />

          {/* Make */}
          <select
            value={current.make || ''}
            onChange={(e) => update('make', e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] bg-white"
          >
            <option value="">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Year */}
          <select
            value={current.year || ''}
            onChange={(e) => update('year', e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] bg-white"
          >
            <option value="">Any Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Condition */}
          <select
            value={current.condition || ''}
            onChange={(e) => update('condition', e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] bg-white"
          >
            <option value="">Any Condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price"
            defaultValue={current.minPrice || ''}
            onBlur={(e) => update('minPrice', e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] w-28"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max Price"
            defaultValue={current.maxPrice || ''}
            onBlur={(e) => update('maxPrice', e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] w-28"
          />

          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors ml-auto"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
