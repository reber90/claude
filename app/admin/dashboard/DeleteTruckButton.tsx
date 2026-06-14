'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteTruckButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/trucks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete truck')
      }
    } catch {
      alert('Error deleting truck')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {loading ? '…' : 'Delete'}
    </button>
  )
}
