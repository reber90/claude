import Link from 'next/link'
import { getAllTrucks } from '@/lib/trucks'
import type { Truck as TruckType } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { PlusCircle, Truck as TruckIcon, CheckCircle, Star, Pencil } from 'lucide-react'
import DeleteTruckButton from './DeleteTruckButton'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  let trucks: TruckType[] = []
  try {
    trucks = await getAllTrucks()
  } catch {
    // Supabase not configured
  }

  const total = trucks.length
  const available = trucks.filter((t) => t.is_available).length
  const featured = trucks.filter((t) => t.is_featured).length

  const stats = [
    { label: 'Total Trucks', value: total, icon: TruckIcon, color: 'bg-blue-500' },
    { label: 'Available', value: available, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Featured', value: featured, icon: Star, color: 'bg-[#f59e0b]' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a]">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your truck inventory</p>
        </div>
        <Link
          href="/admin/trucks/new"
          className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0f172a] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Truck
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`${stat.color} rounded-xl p-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0f172a]">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trucks table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-[#0f172a]">All Trucks</h2>
          <span className="text-slate-500 text-sm">{total} total</span>
        </div>

        {trucks.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <TruckIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No trucks yet</p>
            <Link href="/admin/trucks/new" className="text-[#f59e0b] text-sm hover:underline mt-2 inline-block">
              Add your first truck →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Year</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Condition</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trucks.map((truck) => (
                  <tr key={truck.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0f172a] truncate max-w-xs">{truck.title}</div>
                      <div className="text-slate-400 text-xs truncate">{truck.make} {truck.model}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{truck.year}</td>
                    <td className="px-4 py-4 font-semibold text-[#0f172a]">{formatPrice(truck.price)}</td>
                    <td className="px-4 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">
                        {truck.condition}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          truck.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {truck.is_available ? 'Available' : 'Sold'}
                        </span>
                        {truck.is_featured && (
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/trucks/${truck.id}/edit`}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <DeleteTruckButton id={truck.id} title={truck.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
