export interface Truck {
  id: string
  created_at: string
  updated_at: string
  title: string
  make: string
  model: string
  year: number
  price: number | null
  mileage: number | null
  condition: 'Excellent' | 'Good' | 'Fair' | 'Parts Only'
  transmission: 'Automatic' | 'Manual'
  fuel_type: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'
  drivetrain: '4WD' | 'AWD' | 'RWD' | '2WD'
  engine: string | null
  color: string | null
  vin: string | null
  description: string | null
  features: string[]
  images: string[]
  is_available: boolean
  is_featured: boolean
}

export type TruckInsert = Omit<Truck, 'id' | 'created_at' | 'updated_at'>
export type TruckUpdate = Partial<TruckInsert>
