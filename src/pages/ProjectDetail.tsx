import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { projects } from '../data/projects'
import { CTA, Head, PageHero, TechRow } from '../components/ui'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = projects.find(x => x.slug === slug)
  if (!p) return <NotFound />
  return (
    <>
      <PageHero title={p.title} text={p.summary}><span className="tag">{p.category}</span> <span className="tag">Sample project</span></PageHero>
      <section className="section"><div className="wrap grid gap-8 md:gap-12 md:grid-cols-2">
        <div><Head title="Problem statement" /><p className="text-slate-600">{p.problem}</p></div>
        <div><Head title="Our solution" /><p className="text-slate-600">{p.solution}</p></div></div></section>
      <section className="section pt-0"><div className="wrap"><Head title="Key features" /><div className="grid gap-5 sm:grid-cols-3">{p.features.map(f => <div key={f} className="card flex gap-2 font-bold text-navy"><Check className="text-orange" />{f}</div>)}</div>
        <div className="mt-10"><Head title="Technologies" /><TechRow items={p.tech} /></div>
        <Link to="/portfolio" className="btn-p mt-10">Back to portfolio</Link></div></section>
      <CTA />
    </>
  )
}
