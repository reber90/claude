import { notFound } from 'next/navigation'
import { getTruck } from '@/lib/trucks'
import TruckForm from '../../TruckForm'

export const metadata = { title: 'Edit Truck' }

export default async function EditTruckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let truck = null
  try {
    truck = await getTruck(id)
  } catch {
    // Supabase not configured
  }

  if (!truck) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0f172a]">Edit Truck</h1>
        <p className="text-slate-500 text-sm mt-1">
          {truck.year} {truck.make} {truck.model}
        </p>
      </div>
      <TruckForm truck={truck} />
    </div>
  )
}
