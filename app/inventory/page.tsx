import { getTrucks, getDistinctMakes } from '@/lib/trucks'
import TruckCard from '@/app/components/TruckCard'
import InventoryFilters from '@/app/components/InventoryFilters'
import { Truck } from 'lucide-react'
import type { Truck as TruckType } from '@/lib/types'

export const metadata = { title: 'Inventory' }

interface Props {
  searchParams: Promise<{
    search?: string
    make?: string
    minPrice?: string
    maxPrice?: string
    year?: string
    condition?: string
  }>
}

export default async function InventoryPage({ searchParams }: Props) {
  const params = await searchParams

  let trucks: TruckType[] = []
  let makes: string[] = []

  try {
    [trucks, makes] = await Promise.all([
      getTrucks({
        search: params.search,
        make: params.make,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        year: params.year ? Number(params.year) : undefined,
        condition: params.condition,
      }),
      getDistinctMakes(),
    ])
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page header */}
      <div className="bg-[#0f172a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Browse Our Inventory</h1>
          <p className="text-slate-400">
            {trucks.length} truck{trucks.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <InventoryFilters makes={makes} current={params} />

        {/* Results */}
        {trucks.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-200 rounded-full mb-6">
              <Truck className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">No trucks found</h2>
            <p className="text-slate-500">Try adjusting your filters or check back soon for new inventory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {trucks.map((truck) => (
              <TruckCard key={truck.id} truck={truck} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
