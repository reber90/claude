'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400" style={{ aspectRatio: '4 / 3' }}>
        <svg className="w-20 h-20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h6l2-1zm0 0l1-4 3 1 2 3H13z" />
        </svg>
        <span className="text-sm font-medium">No photos available</span>
      </div>
    )
  }

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(images.length - 1, i))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el || !el.clientWidth) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div>
      {/* Fixed ratio swipeable frame: every photo fills the same 4:3 box */}
      <div className="relative w-full bg-slate-100 rounded-2xl overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {images.map((img, i) => (
            <div key={i} className="relative w-full h-full shrink-0 snap-center">
              <Image
                src={img}
                alt={`${title} photo ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => scrollToIndex(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0f172a] rounded-full p-2 shadow"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToIndex(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0f172a] rounded-full p-2 shadow"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${i === index ? 'bg-[#f59e0b] w-4 h-1.5' : 'bg-white/70 w-1.5 h-1.5'}`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === index ? 'border-[#f59e0b] shadow-md' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
