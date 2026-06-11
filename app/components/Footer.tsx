import Link from 'next/link'
import { Truck, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#f59e0b] rounded-lg p-1.5">
                <Truck className="w-5 h-5 text-[#0f172a]" />
              </div>
              <span className="text-white text-xl font-bold">
                Truck<span className="text-[#f59e0b]">Deal</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted source for quality pre-owned trucks. We specialize in work trucks, lifted trucks, and commercial vehicles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#f59e0b] transition-colors">Home</Link></li>
              <li><Link href="/inventory" className="hover:text-[#f59e0b] transition-colors">Browse Inventory</Link></li>
              <li><Link href="/contact" className="hover:text-[#f59e0b] transition-colors">Contact Us</Link></li>
              <li><Link href="/admin" className="hover:text-[#f59e0b] transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>info@truckdeal.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                <span>123 Dealer Row, Truck City, TX 75001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-sm text-slate-500 text-center">
          &copy; {new Date().getFullYear()} TruckDeal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
