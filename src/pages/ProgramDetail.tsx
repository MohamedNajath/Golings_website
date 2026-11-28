import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { programBySlug, programs } from '../data/internship'
import { useSeo } from '../hooks/useSeo'
import { SITE_URL } from '../data/internshipConfig'
import NotFound from './NotFound'

export default function ProgramDetail() {
  const { slug } = useParams(); const p = programBySlug(slug)
  useSeo({
    title: p ? `${p.title} Internship | Goalings` : 'Program not found | Goalings', description: p ? `${p.tagline} ${p.description}`.slice(0, 300) : 'Program not found', path: `/internship-training/${slug}`,
    jsonLd: p ? [{ '@context': 'https://schema.org', '@type': 'Course', name: p.title, description: p.description, timeRequired: 'P6M', provider: { '@type': 'Organization', name: 'Goalings', url: SITE_URL } }] : [],
  })
  if (!p) return <NotFound />
  const others = programs.filter(x => x.slug !== p.slug)
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-navy py-14 text-white sm:py-20">
        <div className="absolute -right-24 -top-32 h-64 w-64 rounded-full bg-orange/25 blur-3xl sm:h-96 sm:w-96" />
        <div className="wrap relative">
          <Link to="/internship-training#programs" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-orange"><ArrowLeft size={16} />All programs</Link>
          <div className="flex items-center gap-4"><span className="icon h-14 w-14 bg-white/10"><p.icon size={28} /></span><span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-bold"><Clock size={14} />{p.duration}</span></div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{p.title}</h1>
          <p className="mt-2 text-xl font-semibold text-orange">{p.tagline}</p>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{p.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to={`/internship-training?program=${p.slug}#apply`} className="btn-p">Apply Now <ArrowRight size={18} /></Link><Link to="/internship-training#roadmap" className="btn-g">See the six-month roadmap</Link></div>
        </div>
      </div>

      <section className="section"><div className="wrap">
        <h2 className="h2">{p.groups.length > 1 ? 'Training curriculum' : p.groups[0].title}</h2>
        <div className={`grid gap-5 ${p.groups.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-4' : ''}`}>{p.groups.map(g => (
          <div key={g.title} className="card hover:translate-y-0">{p.groups.length > 1 && <h3 className="mb-3 font-bold text-navy">{g.title}</h3>}
            <ul className={`gap-x-8 gap-y-2 text-sm text-slate-700 ${p.groups.length === 1 ? 'grid sm:grid-cols-2 lg:grid-cols-3' : 'space-y-1.5'}`}>{g.items.map(i => <li key={i} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-orange" />{i}</li>)}</ul></div>))}</div>
      </div></section>

      <section className="section bg-white"><div className="wrap grid gap-6 lg:grid-cols-2">
        <div className="card hover:translate-y-0"><h2 className="mb-2 text-xl font-bold text-navy">{p.practicalTitle}</h2><p className="text-slate-600">{p.practicalText}</p>
          {p.practical.length > 0 && <ul className="mt-4 flex flex-wrap gap-2">{p.practical.map(x => <li key={x} className="tag">{x}</li>)}</ul>}</div>
        <div className="card hover:translate-y-0"><h2 className="mb-3 text-xl font-bold text-navy">Career opportunities</h2><ul className="flex flex-wrap gap-2">{p.careers.map(x => <li key={x} className="rounded-full bg-navy px-3 py-1 text-sm font-semibold text-white">{x}</li>)}</ul>
          <p className="mt-4 text-sm text-slate-500">Career outcomes depend on individual performance. Employment at Goalings is not guaranteed.</p></div>
      </div></section>

      <section className="section"><div className="wrap">
        <h2 className="h2">Other programs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{others.map(o => <Link key={o.slug} to={`/internship-training/${o.slug}`} className="card flex items-center gap-3"><span className="icon shrink-0"><o.icon size={20} /></span><span className="font-bold text-navy">{o.title}</span></Link>)}</div>
        <div className="mt-8"><Link to={`/internship-training?program=${p.slug}#apply`} className="btn-p">Apply for {p.formLabel} <ArrowRight size={18} /></Link></div>
      </div></section>
    </>)
}
