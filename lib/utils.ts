import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null): string {
  if (!price) return 'No Price'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(miles: number | null): string {
  if (!miles) return 'N/A'
  return new Intl.NumberFormat('en-US').format(miles) + ' mi'
}
