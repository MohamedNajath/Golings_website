import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Service, processSteps } from '../data/services'
import { Project } from '../data/projects'
import { techLogos } from '../data/techLogos'

export const Reveal = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>{children}</motion.div>)

export const Head = ({ title, text }: { title: string; text?: string }) => (
  <><h2 className="h2">{title}</h2>{text && <p className="lead">{text}</p>}</>)

export const PageHero = ({ title, text, children }: { title: string; text: string; children?: ReactNode }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-navy py-14 text-white sm:py-20 lg:py-24">
    <div className="absolute -right-24 -top-32 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-orange/25 blur-3xl" />
    <div className="wrap relative"><h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-300">{text}</p>{children && <div className="mt-8">{children}</div>}</div></div>)

export const CTA = () => (
  <section className="section"><div className="wrap"><div className="rounded-3xl bg-gradient-to-br from-navy to-navy-2 px-5 py-10 text-center text-white sm:px-8 sm:py-14">
    <h2 className="mx-auto mb-3 max-w-[22ch] text-2xl font-extrabold sm:text-3xl md:text-4xl">Have an idea? Let’s build it.</h2>
    <p className="mx-auto mb-7 max-w-[52ch] text-slate-300">Tell us what you’re working on and we’ll reply with next steps.</p>
    <Link to="/contact" className="btn-p">Start a conversation <ArrowRight size={18} /></Link></div></div></section>)

export const ServiceCard = ({ s }: { s: Service }) => (
  <article className="card flex flex-col"><div className="icon"><s.icon size={22} /></div>
    <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3><p className="mt-1 text-sm text-slate-600">{s.short}</p>
    <ul className="my-4 space-y-1 text-sm text-slate-600">{s.benefits.map(b => <li key={b} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-orange" />{b}</li>)}</ul>
    <Link to={`/services/${s.slug}`} className="mt-auto inline-flex items-center gap-1 font-bold text-navy hover:text-orange">Learn more <ArrowRight size={16} /></Link></article>)

export const ProjectCard = ({ p }: { p: Project }) => (
  <Link to={`/portfolio/${p.slug}`} className="card group overflow-hidden !p-0">
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-navy to-blue-800">{p.image ? <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="absolute inset-x-8 bottom-0 top-7 rounded-t-lg border border-white/25 bg-white/10 transition group-hover:top-4" />}</div>
    <div className="p-6"><span className="text-xs font-bold text-orange">Sample project</span>
      <h3 className="mt-1 text-lg font-bold text-navy">{p.title}</h3><p className="text-sm text-slate-600">{p.category}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">{p.tech.map(t => <span key={t} className="tag">{t}</span>)}</div>
      <span className="mt-4 inline-flex items-center gap-1 font-bold text-navy group-hover:text-orange">View project <ArrowRight size={16} /></span></div></Link>)

export const Process = () => (
  <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{processSteps.map((s, i) => (
    <li key={s.t} className="rounded-2xl border border-white/15 bg-white/5 p-6"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange font-extrabold text-navy">{i + 1}</span>
      <h3 className="mt-3 font-bold">{s.t}</h3><p className="mt-1 text-sm text-slate-300">{s.d}</p></li>))}</ol>)

export const TechLogo = ({ name, className = 'h-9 w-9' }: { name: string; className?: string }) => (
  <img src={techLogos[name]} alt={name} title={name} loading="lazy" className={`${className} object-contain`} />)

export const TechRow = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-3">{items.map(t => <li key={t}>{techLogos[t]
    ? <span className="grid h-16 w-20 place-items-center rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-orange sm:h-[72px] sm:w-24"><TechLogo name={t} className="h-10 w-10 sm:h-11 sm:w-11" /></span>
    : <span className="flex h-16 items-center rounded-xl border border-slate-200 bg-white px-4 font-semibold text-navy sm:h-[72px] sm:px-5">{t}</span>}</li>)}</ul>)

// One smooth orange wave that flows right -> left forever. Pure SVG + CSS, seamless loop.
const WAVE = (() => { let d = 'M0 100'; for (let i = 0; i < 4; i++) { const x = i * 600; d += ` C${x + 100} 20 ${x + 200} 20 ${x + 300} 100 C${x + 400} 180 ${x + 500} 180 ${x + 600} 100` } return d })()
export const FlowLine = ({ className = '' }: { className?: string }) => (
  <div aria-hidden="true" className={`flowline-mask pointer-events-none relative h-24 w-full select-none overflow-hidden sm:h-32 lg:h-40 ${className}`}>
    <svg viewBox="0 0 2400 200" preserveAspectRatio="none" className="flowline-track block h-full max-w-none" style={{ width: 'max(200%, 1500px)' }}>
      <path d={WAVE} fill="none" stroke="#E87524" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  </div>)
