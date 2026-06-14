import { NextRequest, NextResponse } from 'next/server'
import { getTruck, updateTruck, deleteTruck } from '@/lib/trucks'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const truck = await getTruck(id)
  if (!truck) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(truck)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const data = await request.json()
    const truck = await updateTruck(id, data)
    return NextResponse.json(truck)
  } catch {
    return NextResponse.json({ error: 'Failed to update truck' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    await deleteTruck(id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete truck' }, { status: 500 })
  }
}
