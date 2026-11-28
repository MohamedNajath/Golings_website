import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => {
        const on = open === i
        return (
          <div key={f.q} className={`rounded-2xl border bg-white transition ${on ? 'border-orange shadow-md' : 'border-slate-200'}`}>
            <h3><button id={`faq-b-${i}`} aria-expanded={on} aria-controls={`faq-p-${i}`} onClick={() => setOpen(on ? null : i)} className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-navy">
              <span>{f.q}</span><ChevronDown size={20} className={`shrink-0 text-orange transition-transform duration-300 ${on ? 'rotate-180' : ''}`} /></button></h3>
            <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} className={`grid transition-all duration-300 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden"><p className="px-5 pb-5 text-slate-600">{f.a}</p></div>
            </div>
          </div>)
      })}
    </div>)
}
