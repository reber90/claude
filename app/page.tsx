import Link from 'next/link'
import { getFeaturedTrucks } from '@/lib/trucks'
import TruckCard from './components/TruckCard'
import { Shield, Wrench, ThumbsUp, ArrowRight, Phone } from 'lucide-react'
import type { Truck } from '@/lib/types'

export default async function HomePage() {
  let featuredTrucks: Truck[] = []
  try {
    featuredTrucks = await getFeaturedTrucks()
  } catch {
    // Supabase not configured yet
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0f172a] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 70% 50%, #f59e0b 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #1e40af 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-semibold px-3 py-1 rounded-full border border-[#f59e0b]/30 mb-6">
              Premium Pre-Owned Trucks
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Find Your{' '}
              <span className="text-[#f59e0b]">Perfect Truck</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
              Browse our curated selection of quality used trucks — work trucks, lifted rigs, and heavy haulers.
              All vehicles inspected and ready to go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 bg-[#f59e0b] text-[#0f172a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors"
              >
                Browse Inventory
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Featured Trucks */}
      {featuredTrucks.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider mb-2">Hot Picks</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">Featured Trucks</h2>
              </div>
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 text-[#0f172a] font-semibold hover:text-[#f59e0b] transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No trucks state */}
      {featuredTrucks.length === 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider mb-2">Ready to Browse</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">Our Inventory</h2>
            <p className="text-slate-500 mb-8">Check back soon — new trucks are added regularly.</p>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0f172a] px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors"
            >
              Browse Inventory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider mb-2">Our Promise</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">Why Choose TruckDeal?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-7 h-7 text-[#f59e0b]" />,
                title: 'Quality Inspected',
                desc: 'Every truck goes through a thorough inspection before hitting our lot. You get a vehicle you can trust.',
              },
              {
                icon: <Wrench className="w-7 h-7 text-[#f59e0b]" />,
                title: 'Work-Ready Vehicles',
                desc: 'From tow packages to lift kits, our trucks are equipped and ready for whatever job you need done.',
              },
              {
                icon: <ThumbsUp className="w-7 h-7 text-[#f59e0b]" />,
                title: 'No-Hassle Buying',
                desc: "We keep it simple. Browse online, contact us with questions, and drive home happy. No pressure, ever.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f59e0b]/10 rounded-xl mb-5">
                  {item.icon}
                </div>
                <h3 className="text-[#0f172a] font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#f59e0b] py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">
            Ready to Find Your Truck?
          </h2>
          <p className="text-[#0f172a]/70 text-lg mb-8">
            Browse our full inventory or reach out — we&apos;re happy to help you find the right fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center gap-2 bg-[#0f172a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors"
            >
              Browse All Trucks
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#0f172a] text-[#0f172a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#0f172a] hover:text-white transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
