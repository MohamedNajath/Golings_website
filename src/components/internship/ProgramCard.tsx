import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { Program } from '../../data/internship'

export default function ProgramCard({ p, wide }: { p: Program; wide?: boolean }) {
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1.5 hover:border-orange hover:shadow-xl hover:shadow-orange/10 sm:p-6 ${wide ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <span className="icon transition group-hover:scale-110 group-hover:bg-orange group-hover:text-navy"><p.icon size={22} /></span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-navy"><Clock size={13} />{p.duration}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-navy">{p.title}</h3>
      <p className="text-sm font-semibold text-orange">{p.tagline}</p>
      <p className="mt-2 text-sm text-slate-600">{p.short}</p>
      <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Key technologies</h4>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">{p.keyTech.map(t => <li key={t} className="tag">{t}</li>)}</ul>
      <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Career opportunities</h4>
      <p className="mt-1 text-sm text-slate-700">{p.careers.slice(0, 3).join(' · ')}{p.careers.length > 3 && <span className="text-slate-500"> · +{p.careers.length - 3} more</span>}</p>
      <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        <Link to={`/internship-training/${p.slug}`} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border border-navy/20 px-4 py-2.5 text-sm font-bold text-navy transition hover:border-orange hover:text-orange">Learn More <ArrowRight size={15} /></Link>
        <Link to={`/internship-training?program=${p.slug}#apply`} className="btn-p flex-1 !px-4 !py-2.5 text-sm">Apply Now</Link>
      </div>
    </article>)
}
