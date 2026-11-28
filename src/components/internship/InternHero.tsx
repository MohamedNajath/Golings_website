import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Layers, Wifi } from 'lucide-react'
import HeroBackground from '../HeroBackground'
import { TechLogo } from '../ui'
import { programs } from '../../data/internship'

const badges = ['React', 'Java Spring Boot', 'Node.js', 'JavaScript', 'Angular']
const pos = ['-top-4 right-6', 'top-1/3 -left-5', '-bottom-4 left-10', '-bottom-3 right-16', 'top-1/4 -right-4']
const audience = ['University Final-Year Students', 'Higher Education Institute Students', 'Recent Graduates', 'Degree Holders', 'Diploma Holders', 'Aspiring Software Developers']

export default function InternHero() {
  return (
    <section className="relative overflow-hidden bg-navy py-14 text-white sm:py-20 lg:py-24">
      <HeroBackground />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-4 py-1.5 text-sm font-semibold text-orange">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange" /> Internship & Professional Training
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }} className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Turn Your Potential Into <span className="bg-gradient-to-r from-orange to-amber-300 bg-clip-text text-transparent">Professional Experience</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }} className="mt-5 text-lg font-semibold text-sky-100 sm:text-xl">Build Industry-Ready Skills. Work on Real Projects. Launch Your Technology Career.</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.6 }} className="mt-4 max-w-[58ch] text-slate-300">
            Start your professional journey with Goalings through our six-month internship and professional training program. Gain hands-on experience, develop industry-relevant skills, and work on practical software development projects under professional guidance.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.6 }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#apply" className="btn-p">Apply for Internship <ArrowRight size={18} /></a>
            <a href="#programs" className="btn-g">Explore Training Programs</a>
          </motion.div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Who this is for">{audience.map(a => <li key={a} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200">{a}</li>)}</ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }} className="relative mx-auto w-full max-w-md px-4 sm:px-0">
          {badges.map((b, i) => <motion.span key={b} title={b} animate={{ y: [0, -9, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg shadow-black/30 ring-4 ring-[#0d2a50] sm:h-14 sm:w-14 ${pos[i]}`}><TechLogo name={b} className="h-6 w-6 sm:h-8 sm:w-8" /></motion.span>)}
          <div className="rounded-3xl border border-white/15 bg-white/[.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-7">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[[Calendar, '6', 'Months'], [Layers, '5', 'Programs'], [Wifi, '3', 'Training modes']].map(([Icon, n, l]: any) => (
                <div key={l} className="rounded-2xl bg-navy/60 p-3"><Icon className="mx-auto mb-1 text-orange" size={20} /><div className="text-2xl font-extrabold">{n}</div><div className="text-[11px] text-slate-300">{l}</div></div>))}
            </div>
            <ul className="mt-4 space-y-2">{programs.map(p => (
              <li key={p.slug}><Link to={`/internship-training/${p.slug}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm transition hover:border-orange hover:bg-white/10"><p.icon size={18} className="shrink-0 text-orange" /><span className="font-semibold">{p.title}</span></Link></li>))}</ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
