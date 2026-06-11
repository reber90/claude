'use client'

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Truck } from '@/lib/types'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Parts Only'] as const
const TRANSMISSIONS = ['Automatic', 'Manual'] as const
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'] as const
const DRIVETRAINS = ['4WD', 'AWD', 'RWD', '2WD'] as const

const ALL_FEATURES = [
  'Backup Camera', 'Bluetooth', 'Navigation', 'Heated Seats', 'Sunroof',
  'Tow Package', 'Lift Kit', 'Running Boards', 'Bed Liner',
  'Apple CarPlay/Android Auto', 'Lane Departure Warning', 'Blind Spot Monitor',
  'Parking Sensors', 'Remote Start', '4WD Lock',
]

interface Props {
  truck?: Truck
}

export default function TruckForm({ truck }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = !!truck

  const [form, setForm] = useState({
    title: truck?.title || '',
    make: truck?.make || '',
    model: truck?.model || '',
    year: truck?.year?.toString() || new Date().getFullYear().toString(),
    price: truck?.price?.toString() || '',
    mileage: truck?.mileage?.toString() || '',
    condition: truck?.condition || 'Good',
    transmission: truck?.transmission || 'Automatic',
    fuel_type: truck?.fuel_type || 'Gasoline',
    drivetrain: truck?.drivetrain || '4WD',
    engine: truck?.engine || '',
    color: truck?.color || '',
    vin: truck?.vin || '',
    description: truck?.description || '',
    is_available: truck?.is_available ?? true,
    is_featured: truck?.is_featured ?? false,
  })

  const [features, setFeatures] = useState<string[]>(truck?.features || [])
  const [existingImages, setExistingImages] = useState<string[]>(truck?.images || [])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function toggleFeature(f: string) {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  function addImageFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    setNewImageFiles((prev) => [...prev, ...arr])
    arr.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (e) => setNewImagePreviews((prev) => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  function removeNewImage(index: number) {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // 1. Upload new images first
      const uploadedUrls: string[] = []
      for (const file of newImageFiles) {
        const fd = new FormData()
        fd.append('file', file)
        // Use a placeholder truck ID for new trucks, or real ID for edits
        const truckId = truck?.id || 'temp'
        const imgRes = await fetch(`/api/trucks/${truckId}/images`, {
          method: 'POST',
          body: fd,
        })
        if (imgRes.ok) {
          const { url } = await imgRes.json()
          uploadedUrls.push(url)
        }
      }

      const allImages = [...existingImages, ...uploadedUrls]

      const payload = {
        title: form.title,
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        price: form.price ? parseFloat(form.price) : null,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        condition: form.condition,
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        drivetrain: form.drivetrain,
        engine: form.engine || null,
        color: form.color || null,
        vin: form.vin || null,
        description: form.description || null,
        features,
        images: allImages,
        is_available: form.is_available,
        is_featured: form.is_featured,
      }

      const url = isEdit ? `/api/trucks/${truck!.id}` : '/api/trucks'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save truck')
      }

      setSuccess(isEdit ? 'Truck updated successfully!' : 'Truck added successfully!')
      setTimeout(() => router.push('/admin/dashboard'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] bg-white'
  const labelCls = 'block text-slate-700 text-sm font-medium mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="font-bold text-[#0f172a] mb-5 text-lg">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelCls}>Listing Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inputCls} placeholder="e.g. 2021 Ford F-250 Super Duty King Ranch" />
          </div>
          <div>
            <label className={labelCls}>Make *</label>
            <input name="make" value={form.make} onChange={handleChange} required className={inputCls} placeholder="Ford" />
          </div>
          <div>
            <label className={labelCls}>Model *</label>
            <input name="model" value={form.model} onChange={handleChange} required className={inputCls} placeholder="F-250" />
          </div>
          <div>
            <label className={labelCls}>Year *</label>
            <input name="year" type="number" value={form.year} onChange={handleChange} required min="1980" max="2030" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Price ($)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} min="0" step="100" className={inputCls} placeholder="Leave blank for 'Price on Request'" />
          </div>
          <div>
            <label className={labelCls}>Mileage</label>
            <input name="mileage" type="number" value={form.mileage} onChange={handleChange} min="0" className={inputCls} placeholder="e.g. 45000" />
          </div>
          <div>
            <label className={labelCls}>Color</label>
            <input name="color" value={form.color} onChange={handleChange} className={inputCls} placeholder="e.g. Magnetic Gray" />
          </div>
          <div>
            <label className={labelCls}>Engine</label>
            <input name="engine" value={form.engine} onChange={handleChange} className={inputCls} placeholder="e.g. 6.7L Power Stroke V8 Diesel" />
          </div>
          <div>
            <label className={labelCls}>VIN</label>
            <input name="vin" value={form.vin} onChange={handleChange} className={inputCls} placeholder="Vehicle Identification Number" />
          </div>
        </div>
      </div>

      {/* Vehicle Specs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="font-bold text-[#0f172a] mb-5 text-lg">Vehicle Specs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <label className={labelCls}>Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange} className={inputCls}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Transmission</label>
            <select name="transmission" value={form.transmission} onChange={handleChange} className={inputCls}>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fuel Type</label>
            <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className={inputCls}>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Drivetrain</label>
            <select name="drivetrain" value={form.drivetrain} onChange={handleChange} className={inputCls}>
              {DRIVETRAINS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="font-bold text-[#0f172a] mb-5 text-lg">Description</h2>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className={inputCls}
          placeholder="Describe the truck, its history, any notable features or upgrades…"
        />
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="font-bold text-[#0f172a] mb-5 text-lg">Features & Options</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {ALL_FEATURES.map((f) => (
            <label key={f} className={`flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border transition-all text-sm ${
              features.includes(f) ? 'border-[#f59e0b] bg-[#f59e0b]/5 text-[#0f172a] font-medium' : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}>
              <input
                type="checkbox"
                checked={features.includes(f)}
                onChange={() => toggleFeature(f)}
                className="accent-[#f59e0b]"
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="font-bold text-[#0f172a] mb-5 text-lg">Photos</h2>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">Current photos</p>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((url) => (
                <div key={url} className="relative w-24 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                  <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New image previews */}
        {newImagePreviews.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">New photos to upload</p>
            <div className="flex flex-wrap gap-3">
              {newImagePreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border border-[#f59e0b]/50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addImageFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-[#f59e0b] bg-[#f59e0b]/5' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 font-medium text-sm">Drop photos here or click to upload</p>
          <p className="text-slate-400 text-xs mt-1">PNG, JPG, WEBP up to 10MB each</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addImageFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="font-bold text-[#0f172a] mb-5 text-lg">Listing Status</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
              className="w-5 h-5 accent-[#f59e0b] rounded"
            />
            <div>
              <span className="font-medium text-[#0f172a] text-sm">Available for Sale</span>
              <p className="text-slate-400 text-xs">Show this truck on the public inventory page</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="w-5 h-5 accent-[#f59e0b] rounded"
            />
            <div>
              <span className="font-medium text-[#0f172a] text-sm">Featured on Homepage</span>
              <p className="text-slate-400 text-xs">Highlight this truck on the homepage</p>
            </div>
          </label>
        </div>
      </div>

      {/* Error/Success */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f59e0b] text-[#0f172a] px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving…' : isEdit ? 'Update Truck' : 'Add Truck'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
