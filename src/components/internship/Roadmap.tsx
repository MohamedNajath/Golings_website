import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { roadmap } from '../../data/internship'

export default function Roadmap() {
  const [active, setActive] = useState(1)
  return (
    <div>
      <div role="tablist" aria-label="Select a month" className="mb-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:justify-center">
        {roadmap.map(r => (
          <button key={r.m} role="tab" aria-selected={active === r.m} onClick={() => setActive(r.m)}
            className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-bold transition ${active === r.m ? 'border-orange bg-orange text-navy' : 'border-white/25 text-white hover:border-orange'}`}>Month {r.m}</button>))}
      </div>
      <ol className="relative mx-auto max-w-4xl space-y-5 border-l-2 border-white/15 pl-6 sm:pl-10">
        {roadmap.map((r, i) => {
          const on = active === r.m, done = r.m < active
          return (
            <motion.li key={r.m} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: i * 0.04 }} className="relative">
              <span className={`absolute -left-[2.15rem] top-5 grid h-6 w-6 place-items-center rounded-full border-2 text-[10px] font-extrabold transition sm:-left-[3.15rem] sm:h-8 sm:w-8 sm:text-xs ${on ? 'scale-110 border-orange bg-orange text-navy shadow-[0_0_0_6px_rgba(255,122,0,.2)]' : done ? 'border-orange/60 bg-navy text-orange' : 'border-white/30 bg-navy text-slate-300'}`}>{r.m}</span>
              <button onClick={() => setActive(r.m)} aria-expanded={on} className={`w-full rounded-2xl border p-5 text-left transition ${on ? 'border-orange bg-white/10 shadow-lg shadow-orange/10' : 'border-white/15 bg-white/5 hover:border-white/40'}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-orange">Month {String(r.m).padStart(2, '0')}</span>
                <h3 className="text-lg font-bold">{r.title}</h3>
                <div className={`grid transition-all duration-300 ${on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <ul className="grid gap-x-6 gap-y-2 overflow-hidden text-sm text-slate-200 sm:grid-cols-2">{r.items.map(t => <li key={t} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-orange" />{t}</li>)}</ul>
                </div>
              </button>
            </motion.li>)
        })}
      </ol>
      <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/15 bg-white/5 p-4 text-center text-sm text-slate-300">This is a flexible learning roadmap. Learning activities are adapted to the selected specialization, so not every participant studies every technology listed in a program.</p>
    </div>)
}
