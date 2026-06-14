import { redirect } from 'next/navigation'

// The site opens straight on the inventory, no separate landing page
export default function HomePage() {
  redirect('/inventory')
}
