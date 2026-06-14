import { createClient } from '@supabase/supabase-js'
import { Truck, TruckInsert, TruckUpdate } from './types'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

export interface TruckFilters {
  search?: string
  make?: string
  minPrice?: number
  maxPrice?: number
  year?: number
  condition?: string
}

export async function getTrucks(filters?: TruckFilters): Promise<Truck[]> {
  const client = getServiceClient()
  let query = client.from('trucks').select('*').eq('is_available', true).order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,make.ilike.%${filters.search}%,model.ilike.%${filters.search}%`)
  }
  if (filters?.make) {
    query = query.ilike('make', filters.make)
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  if (filters?.year) {
    query = query.eq('year', filters.year)
  }
  if (filters?.condition) {
    query = query.eq('condition', filters.condition)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getTruck(id: string): Promise<Truck | null> {
  const client = getServiceClient()
  const { data, error } = await client.from('trucks').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createTruck(data: TruckInsert): Promise<Truck> {
  const client = getServiceClient()
  const { data: truck, error } = await client
    .from('trucks')
    .insert({ ...data, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return truck
}

export async function updateTruck(id: string, data: TruckUpdate): Promise<Truck> {
  const client = getServiceClient()
  const { data: truck, error } = await client
    .from('trucks')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return truck
}

export async function deleteTruck(id: string): Promise<void> {
  const client = getServiceClient()
  const { error } = await client.from('trucks').delete().eq('id', id)
  if (error) throw error
}

export async function uploadImage(file: File, truckId: string): Promise<string> {
  const client = getServiceClient()
  const ext = file.name.split('.').pop()
  const filename = `${truckId}/${Date.now()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await client.storage.from('truck-images').upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw error

  const { data } = client.storage.from('truck-images').getPublicUrl(filename)
  return data.publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  const client = getServiceClient()
  // Extract path from URL
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/truck-images/')
  if (pathParts.length < 2) return
  const filePath = pathParts[1]
  const { error } = await client.storage.from('truck-images').remove([filePath])
  if (error) throw error
}

export async function getFeaturedTrucks(): Promise<Truck[]> {
  const client = getServiceClient()
  const { data, error } = await client
    .from('trucks')
    .select('*')
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(4)
  if (error) throw error
  return data || []
}

export async function getDistinctMakes(): Promise<string[]> {
  const client = getServiceClient()
  const { data, error } = await client
    .from('trucks')
    .select('make')
    .eq('is_available', true)
    .order('make')
  if (error) throw error
  const makes = [...new Set((data || []).map((r: { make: string }) => r.make))]
  return makes
}

export async function getAllTrucks(): Promise<Truck[]> {
  const client = getServiceClient()
  const { data, error } = await client
    .from('trucks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
