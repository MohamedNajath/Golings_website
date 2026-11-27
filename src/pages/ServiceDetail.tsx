import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronDown, Check } from 'lucide-react'
import { services } from '../data/services'
import { CTA, Head, PageHero, Process, TechRow } from '../components/ui'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [open, setOpen] = useState<number | null>(0)
  const s = services.find(x => x.slug === slug)
  if (!s) return <NotFound />
  const List = ({ items }: { items: string[] }) => <ul className="space-y-3">{items.map(i => <li key={i} className="flex gap-2 text-slate-600"><Check size={18} className="mt-1 shrink-0 text-orange" />{i}</li>)}</ul>
  return (
    <>
      <PageHero title={s.title} text={s.intro}><Link to="/contact" className="btn-p">Discuss your project</Link></PageHero>
      <section className="section"><div className="wrap grid gap-8 md:gap-12 md:grid-cols-2">
        <div><Head title="Challenges we solve" /><List items={s.challenges} /></div>
        <div><Head title="Our solutions" /><List items={s.solutions} /></div></div></section>
      <section className="section pt-0"><div className="wrap"><Head title="Features and benefits" /><div className="grid gap-5 sm:grid-cols-3">{s.benefits.map(b => <div key={b} className="card font-bold text-navy">{b}</div>)}</div></div></section>
      <section className="section dark-sec"><div className="wrap"><Head title="Our process" /><Process /></div></section>
      <section className="section"><div className="wrap"><Head title="Technologies" /><TechRow items={s.tech} /></div></section>
      <section className="section pt-0"><div className="wrap max-w-3xl"><Head title="Frequently asked questions" />
        {s.faqs.map((f, i) => <div key={f.q} className="border-b border-slate-200">
          <button className="flex w-full items-center justify-between py-4 text-left font-bold text-navy" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{f.q}<ChevronDown className={open === i ? 'rotate-180 transition' : 'transition'} /></button>
          {open === i && <p className="pb-4 text-slate-600">{f.a}</p>}</div>)}</div></section>
      <CTA />
    </>
  )
}
