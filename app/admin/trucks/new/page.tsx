import TruckForm from '../TruckForm'

export const metadata = { title: 'Add Truck' }

export default function NewTruckPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0f172a]">Add New Truck</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to add a new vehicle to your inventory</p>
      </div>
      <TruckForm />
    </div>
  )
}
