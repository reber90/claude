import { NextRequest, NextResponse } from 'next/server'
import { createTruck } from '@/lib/trucks'
import { isAdminAuthenticated } from '@/lib/auth'
import { TruckInsert } from '@/lib/types'

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows: Record<string, string>[] = await request.json()
  const results = { success: 0, errors: [] as string[] }

  for (const row of rows) {
    try {
      const truck: TruckInsert = {
        title: row.title || `${row.year} ${row.make} ${row.model}`,
        make: row.make,
        model: row.model,
        year: Number(row.year),
        price: row.price ? Number(row.price) : null,
        mileage: row.mileage ? Number(row.mileage) : null,
        condition: (row.condition as TruckInsert['condition']) || 'Good',
        transmission: (row.transmission as TruckInsert['transmission']) || 'Automatic',
        fuel_type: (row.fuel_type as TruckInsert['fuel_type']) || 'Gasoline',
        drivetrain: (row.drivetrain as TruckInsert['drivetrain']) || '4WD',
        engine: row.engine || null,
        color: row.color || null,
        vin: row.vin || null,
        description: row.description || null,
        features: row.features ? row.features.split(';').map((f) => f.trim()).filter(Boolean) : [],
        images: [],
        is_available: row.is_available !== 'false',
        is_featured: row.is_featured === 'true',
      }
      await createTruck(truck)
      results.success++
    } catch (e) {
      results.errors.push(`Row ${results.success + results.errors.length + 1}: ${e}`)
    }
  }

  return NextResponse.json({ imported: results.success, errors: results.errors })
}
