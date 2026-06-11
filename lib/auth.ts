import { createHash } from 'crypto'
import { NextRequest } from 'next/server'

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false
  const expected = hashPassword(process.env.ADMIN_PASSWORD || '')
  return token === expected
}
