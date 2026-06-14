import Link from 'next/link'
import Image from 'next/image'
import { Truck } from '@/lib/types'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Fuel, Gauge, Settings2, ArrowRight } from 'lucide-react'

interface TruckCardProps {
  truck: Truck
}

export default function TruckCard({ truck }: TruckCardProps) {
  const primaryImage = truck.images?.[0] || null

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group border border-slate-100">
      {/* Image (tap to open the listing) */}
      <Link href={`/inventory/${truck.id}`} className="relative h-52 bg-slate-100 overflow-hidden block">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={truck.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h6l2-1zm0 0l1-4 3 1 2 3H13z" />
            </svg>
            <span className="text-sm">No Image</span>
          </div>
        )}
        {truck.is_featured && (
          <span className="absolute top-3 left-3 bg-[#f59e0b] text-[#0f172a] text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 bg-[#0f172a]/80 text-white text-xs px-2 py-1 rounded-full">
          {truck.condition}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[#0f172a] font-bold text-lg leading-tight mb-1 line-clamp-2">
          {truck.year} {truck.make} {truck.model}
        </h3>
        {truck.title && truck.title !== `${truck.year} ${truck.make} ${truck.model}` && (
          <p className="text-slate-500 text-sm mb-3 line-clamp-1">{truck.title}</p>
        )}

        {/* Spec badges */}
        <div className="flex flex-wrap gap-2 my-3">
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
            <Gauge className="w-3 h-3" />
            {formatMileage(truck.mileage)}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
            <Fuel className="w-3 h-3" />
            {truck.fuel_type}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
            <Settings2 className="w-3 h-3" />
            {truck.transmission}
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
          <span className="text-2xl font-bold text-[#0f172a]">{formatPrice(truck.price)}</span>
          <Link
            href={`/inventory/${truck.id}`}
            className="inline-flex items-center gap-1.5 bg-[#f59e0b] text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
