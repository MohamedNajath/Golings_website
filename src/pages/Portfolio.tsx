import { useState } from 'react'
import { categories, projects } from '../data/projects'
import { CTA, PageHero, ProjectCard } from '../components/ui'

export default function Portfolio() {
  const [cat, setCat] = useState<string>('All')
  const list = projects.filter(p => cat === 'All' || p.category === cat)
  return (
    <>
      <PageHero title="Portfolio" text="Sample projects shown as demonstrations until real client work is added." />
      <section className="section"><div className="wrap">
        <div className="mb-8 flex flex-wrap gap-2">{['All', ...categories].map(c => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? 'border-orange bg-orange font-bold text-navy' : 'border-slate-300 bg-white'}`}>{c}</button>)}</div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(p => <ProjectCard key={p.slug} p={p} />)}</div></div></section>
      <CTA />
    </>
  )
}
