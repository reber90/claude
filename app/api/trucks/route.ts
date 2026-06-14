import { NextRequest, NextResponse } from 'next/server'
import { getTrucks, createTruck } from '@/lib/trucks'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = {
    search: searchParams.get('search') || undefined,
    make: searchParams.get('make') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    condition: searchParams.get('condition') || undefined,
  }
  try {
    const trucks = await getTrucks(filters)
    return NextResponse.json(trucks)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trucks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const data = await request.json()
    const truck = await createTruck(data)
    return NextResponse.json(truck, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create truck' }, { status: 500 })
  }
}
