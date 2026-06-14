import { notFound } from 'next/navigation'
import { getTruck } from '@/lib/trucks'
import { formatPrice, formatMileage } from '@/lib/utils'
import ImageGallery from './ImageGallery'
import Link from 'next/link'
import { Check, Phone, Mail, ArrowLeft, Calendar, Gauge, Settings2, Fuel, Truck, Palette, Hash, Star } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const truck = await getTruck(id)
    if (!truck) return { title: 'Truck Not Found' }
    return { title: `${truck.year} ${truck.make} ${truck.model}` }
  } catch {
    return { title: 'Truck Details' }
  }
}

export default async function TruckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let truck = null
  try {
    truck = await getTruck(id)
  } catch {
    // Supabase not configured
  }

  if (!truck) notFound()

  const specs = [
    { label: 'Year', value: truck.year.toString(), icon: <Calendar className="w-4 h-4" /> },
    { label: 'Mileage', value: formatMileage(truck.mileage), icon: <Gauge className="w-4 h-4" /> },
    { label: 'Transmission', value: truck.transmission, icon: <Settings2 className="w-4 h-4" /> },
    { label: 'Fuel Type', value: truck.fuel_type, icon: <Fuel className="w-4 h-4" /> },
    { label: 'Drivetrain', value: truck.drivetrain, icon: <Truck className="w-4 h-4" /> },
    { label: 'Engine', value: truck.engine || 'N/A', icon: <Settings2 className="w-4 h-4" /> },
    { label: 'Color', value: truck.color || 'N/A', icon: <Palette className="w-4 h-4" /> },
    { label: 'Condition', value: truck.condition, icon: <Star className="w-4 h-4" /> },
    { label: 'VIN', value: truck.vin || 'N/A', icon: <Hash className="w-4 h-4" /> },
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#0f172a] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#f59e0b] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <ImageGallery images={truck.images || []} title={truck.title} />
            </div>

            {/* Specs Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-[#0f172a] mb-5">Vehicle Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">
                      <span className="text-[#f59e0b]">{spec.icon}</span>
                      {spec.label}
                    </div>
                    <p className="text-[#0f172a] font-semibold text-sm break-all">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {truck.features && truck.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-[#0f172a] mb-5">Features & Options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {truck.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 text-slate-700">
                      <div className="w-5 h-5 bg-[#f59e0b]/10 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#f59e0b]" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {truck.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-[#0f172a] mb-4">About This Truck</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{truck.description}</p>
              </div>
            )}
          </div>

          {/* Right column: Price + Contact */}
          <div className="space-y-5">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              {truck.is_featured && (
                <div className="inline-flex items-center gap-1.5 bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Star className="w-3.5 h-3.5" />
                  Featured Vehicle
                </div>
              )}
              <h1 className="text-2xl font-extrabold text-[#0f172a] leading-tight mb-1">
                {truck.year} {truck.make} {truck.model}
              </h1>
              {truck.title && truck.title !== `${truck.year} ${truck.make} ${truck.model}` && (
                <p className="text-slate-500 text-sm mb-3">{truck.title}</p>
              )}

              <div className="text-4xl font-extrabold text-[#0f172a] my-4">
                {formatPrice(truck.price)}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  truck.is_available
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {truck.is_available ? 'Available' : 'Sold'}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                  {truck.condition}
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:5551234567"
                  className="flex items-center justify-center gap-2 w-full bg-[#f59e0b] text-[#0f172a] px-6 py-3.5 rounded-xl font-bold hover:bg-amber-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call (555) 123-4567
                </a>
                <a
                  href={`mailto:info@truckdeal.com?subject=Inquiry: ${truck.year} ${truck.make} ${truck.model}&body=Hello, I'm interested in the ${truck.year} ${truck.make} ${truck.model} listed at ${formatPrice(truck.price)}. Please contact me with more details.`}
                  className="flex items-center justify-center gap-2 w-full border-2 border-[#0f172a] text-[#0f172a] px-6 py-3.5 rounded-xl font-bold hover:bg-[#0f172a] hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </div>

              <p className="text-slate-400 text-xs text-center mt-4">
                Mention this listing when you call or email
              </p>
            </div>

            {/* Quick Specs */}
            <div className="bg-[#0f172a] rounded-2xl p-5 text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Quick Specs</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Make</span>
                  <span className="font-medium">{truck.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model</span>
                  <span className="font-medium">{truck.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Year</span>
                  <span className="font-medium">{truck.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mileage</span>
                  <span className="font-medium">{formatMileage(truck.mileage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Drivetrain</span>
                  <span className="font-medium">{truck.drivetrain}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
