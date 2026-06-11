import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#0f172a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Contact Us</h1>
          <p className="text-slate-400">We&apos;re here to help you find the perfect truck.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Get In Touch</h2>
              <p className="text-slate-600 leading-relaxed">
                Have questions about a specific truck? Want to schedule a viewing? Reach out and we&apos;ll get back to you right away.
              </p>
            </div>

            {[
              { icon: <Phone className="w-5 h-5 text-[#f59e0b]" />, label: 'Phone', value: '(555) 123-4567', href: 'tel:+15551234567' },
              { icon: <Mail className="w-5 h-5 text-[#f59e0b]" />, label: 'Email', value: 'info@truckdeal.com', href: 'mailto:info@truckdeal.com' },
              { icon: <MapPin className="w-5 h-5 text-[#f59e0b]" />, label: 'Address', value: '123 Dealer Row, Truck City, TX 75001', href: null },
              { icon: <Clock className="w-5 h-5 text-[#f59e0b]" />, label: 'Hours', value: 'Mon–Sat: 8am–6pm  |  Sun: Closed', href: null },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-[#0f172a] font-semibold hover:text-[#f59e0b] transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[#0f172a] font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6">Send Us a Message</h2>
            <form action={`mailto:info@truckdeal.com`} method="get" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" name="name" placeholder="Your name" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" name="phone" placeholder="(555) 000-0000" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" placeholder="your@email.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea name="body" rows={5} placeholder="Tell us about the truck you're looking for, or ask about a specific listing…" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b] resize-none" />
              </div>
              <button type="submit" className="w-full bg-[#f59e0b] text-[#0f172a] py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
