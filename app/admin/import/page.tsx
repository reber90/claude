'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Download, Upload, AlertCircle, CheckCircle, FileText, X } from 'lucide-react'

const CSV_HEADERS = [
  'title', 'make', 'model', 'year', 'price', 'mileage', 'condition',
  'transmission', 'fuel_type', 'drivetrain', 'engine', 'color', 'vin',
  'description', 'features', 'is_available', 'is_featured',
]

const SAMPLE_ROWS = [
  [
    '2021 Ford F-250 Super Duty Lariat', 'Ford', 'F-250', '2021', '58000', '32000',
    'Excellent', 'Automatic', 'Diesel', '4WD', '6.7L Power Stroke V8',
    'Magnetic Gray', '1FT7W2BT0MED12345',
    'One owner, dealer serviced, tow package, bed liner.',
    'Tow Package|Bed Liner|Backup Camera|Bluetooth',
    'true', 'true',
  ],
]

function downloadTemplate() {
  const csv = [CSV_HEADERS.join(','), SAMPLE_ROWS.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'truck-import-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

type ParsedRow = Record<string, string>

export default function ImportPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<ParsedRow[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null)

  function parseFile(file: File) {
    setFileName(file.name)
    setPreview([])
    setErrors([])
    setResult(null)
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrors(results.errors.map((e) => e.message))
        }
        setPreview(results.data.slice(0, 10))
      },
    })
  }

  function handleFileChange(files: FileList | null) {
    if (!files || files.length === 0) return
    parseFile(files[0])
  }

  async function handleImport() {
    if (preview.length === 0) return
    setImporting(true)
    setResult(null)
    try {
      // Re-parse the full file
      const fileInput = fileRef.current
      if (!fileInput?.files?.[0]) return

      await new Promise<void>((resolve) => {
        Papa.parse<ParsedRow>(fileInput.files![0], {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const trucks = results.data.map((row) => ({
              title: row.title || `${row.year} ${row.make} ${row.model}`,
              make: row.make,
              model: row.model,
              year: parseInt(row.year) || new Date().getFullYear(),
              price: row.price ? parseFloat(row.price) : null,
              mileage: row.mileage ? parseInt(row.mileage) : null,
              condition: row.condition || 'Good',
              transmission: row.transmission || 'Automatic',
              fuel_type: row.fuel_type || 'Gasoline',
              drivetrain: row.drivetrain || '4WD',
              engine: row.engine || null,
              color: row.color || null,
              vin: row.vin || null,
              description: row.description || null,
              features: row.features ? row.features.split('|').map((f: string) => f.trim()).filter(Boolean) : [],
              images: [],
              is_available: row.is_available !== 'false',
              is_featured: row.is_featured === 'true',
            }))

            const res = await fetch('/api/trucks/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(trucks),
            })

            const data = await res.json()
            setResult(data)
            resolve()
          },
        })
      })
    } catch {
      setResult({ imported: 0, errors: ['Import failed. Please try again.'] })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0f172a]">Import Trucks via CSV</h1>
        <p className="text-slate-500 text-sm mt-1">Bulk import your inventory from a CSV file</p>
      </div>

      <div className="space-y-6">
        {/* Template download */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="font-bold text-[#0f172a] mb-3">Step 1: Download Template</h2>
          <p className="text-slate-500 text-sm mb-4">
            Download the CSV template with the correct column headers. Use <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">|</code> to separate multiple features (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">Tow Package|Bluetooth|Backup Camera</code>).
          </p>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Template CSV
          </button>

          <div className="mt-4 overflow-x-auto">
            <table className="text-xs text-slate-500 border-collapse">
              <thead>
                <tr>
                  {CSV_HEADERS.map((h) => (
                    <th key={h} className="border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-slate-200 px-2 py-1 max-w-xs truncate">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* File upload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="font-bold text-[#0f172a] mb-3">Step 2: Upload Your CSV</h2>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files) }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-[#f59e0b] bg-[#f59e0b]/5' : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            {fileName ? (
              <div>
                <p className="text-[#0f172a] font-semibold flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-[#f59e0b]" />
                  {fileName}
                </p>
                <p className="text-slate-400 text-sm mt-1">{preview.length} rows loaded</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 font-medium">Drop your CSV file here or click to browse</p>
                <p className="text-slate-400 text-sm mt-1">Only .csv files are supported</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
            />
          </div>

          {errors.length > 0 && (
            <div className="mt-4 space-y-1">
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {err}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0f172a]">Step 3: Preview & Import</h2>
              <button onClick={() => { setPreview([]); setFileName('') }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-4">Showing first {preview.length} rows.</p>

            <div className="overflow-x-auto mb-5 rounded-lg border border-slate-200">
              <table className="text-xs w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {Object.keys(preview[0]).map((k) => (
                      <th key={k} className="px-3 py-2 text-left text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-3 py-2 text-slate-700 max-w-[150px] truncate">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleImport}
              disabled={importing}
              className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0f172a] px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              {importing ? 'Importing…' : `Import ${preview.length}+ Trucks`}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-2xl p-5 border ${result.errors.length === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className={`w-5 h-5 ${result.errors.length === 0 ? 'text-green-600' : 'text-yellow-600'}`} />
              <span className={`font-bold ${result.errors.length === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                Import Complete: {result.imported} trucks imported
              </span>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-yellow-700 text-sm font-medium">{result.errors.length} errors:</p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-yellow-600 text-xs">• {e}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
