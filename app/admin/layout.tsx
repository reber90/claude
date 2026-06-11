import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, LayoutDashboard, PlusCircle, List, Upload } from 'lucide-react'
import LogoutButton from './components/LogoutButton'

export const metadata: Metadata = {
  title: { default: 'Admin | TruckDeal', template: '%s | Admin TruckDeal' },
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/trucks/new', label: 'Add Truck', icon: PlusCircle },
  { href: '/admin/dashboard', label: 'All Trucks', icon: List },
  { href: '/admin/import', label: 'Import CSV', icon: Upload },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] flex flex-col shrink-0 fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-700">
          <div className="bg-[#f59e0b] rounded-lg p-1.5">
            <Truck className="w-5 h-5 text-[#0f172a]" />
          </div>
          <span className="text-white text-lg font-extrabold">
            Truck<span className="text-[#f59e0b]">Deal</span>
          </span>
          <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium group"
            >
              <item.icon className="w-4 h-4 text-slate-400 group-hover:text-[#f59e0b] transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="p-6 md:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
