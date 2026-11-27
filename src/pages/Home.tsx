import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { services } from '../data/services'
import { projects } from '../data/projects'
import HeroBackground from '../components/HeroBackground'
import { CTA, FlowLine, Head, Process, ProjectCard, Reveal, ServiceCard, TechLogo, TechRow } from '../components/ui'

const chips = ['React', 'Java Spring Boot', 'Node.js', 'Angular', 'JavaScript']
const strip = ['React', 'Angular', 'JavaScript', 'Node.js', 'Java Spring Boot']
const stack = ['React', 'Angular', 'JavaScript', 'Node.js', 'Java Spring Boot', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'MySQL']

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-[#06152b] py-12 text-white sm:py-16">
        <HeroBackground />
        <div className="wrap relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h1 className="mb-5 text-[2.1rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Transforming ideas into <span className="bg-gradient-to-r from-orange to-amber-300 bg-clip-text text-transparent">powerful digital solutions.</span></h1>
            <p className="mb-8 max-w-[52ch] text-base text-slate-300 sm:text-lg">We design, develop, and deliver innovative software solutions that help businesses grow, automate, and succeed in the digital world.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"><Link to="/services" className="btn-p">Explore our services</Link><Link to="/contact" className="btn-g">Let’s talk</Link></div>
          </div>
          <div className="relative mx-auto w-full max-w-[17rem] px-3 sm:max-w-[22rem] lg:max-w-[26rem]">
            {chips.map((c, i) => <motion.span key={c} title={c} animate={{ y: [0, -10, 0] }} transition={{ duration: 5 + i, repeat: Infinity }} className={`absolute z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg shadow-black/30 ring-4 ring-[#0d2a50] sm:h-14 sm:w-14 ${['top-1 right-3 sm:top-4', 'top-1/3 -left-3 sm:-left-5', 'bottom-10 -left-1 sm:bottom-14', '-bottom-2 right-12 sm:right-16', 'top-1/2 -right-3 sm:-right-5'][i]}`}><TechLogo name={c} className="h-6 w-6 sm:h-8 sm:w-8" /></motion.span>)}
            <div className="mx-auto grid aspect-square w-full place-items-center rounded-full border border-white/20 bg-white shadow-2xl shadow-black/30">
              <img src="/goalings-mark.png" alt="Goalings" width={512} height={512} className="h-[54%] w-[54%] object-contain sm:h-[62%] sm:w-[62%]" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-6 sm:py-8"><div className="wrap flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-500 sm:gap-x-10"><span className="w-full sm:w-auto">Built with</span>{strip.map(n => <TechLogo key={n} name={n} className="h-8 w-8 sm:h-9 sm:w-9" />)}</div></section>

      <section className="section relative overflow-hidden bg-white pb-0 sm:pb-0 lg:pb-0"><div className="wrap grid items-center gap-6 md:gap-10 md:grid-cols-2"><Reveal><img src="/goalings-logo.png" alt="Goalings" className="h-auto w-full max-w-[28rem] object-contain" /></Reveal>
        <Reveal><p className="text-slate-600">GOALINGS is an information technology and software development company. We build custom software, web applications and websites, design interfaces and brands, advise on technology, and train the next generation of developers.</p><Link to="/about" className="mt-5 inline-flex items-center gap-1 font-bold text-navy hover:text-orange">About Goalings <ArrowRight size={16} /></Link></Reveal></div>
        <FlowLine className="mt-8 sm:mt-10" /></section>

      <section className="section pt-0"><div className="wrap"><Head title="Software, design and advice under one roof" text="From a first sketch to a system your team uses every day." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.slice(0, 6).map(s => <Reveal key={s.slug}><ServiceCard s={s} /></Reveal>)}</div>
        <Link to="/services" className="btn-p mt-8">All services</Link></div></section>

      <section className="section dark-sec"><div className="wrap"><Head title="Why choose Goalings" text="A focused team that builds what your business needs and explains it in plain language." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['Built around you', 'Every solution starts from your workflow.'], ['Clear communication', 'Regular updates and demos.'], ['Modern stack', 'Maintainable code on proven technology.'], ['Support after launch', 'Maintenance as your needs grow.']].map(([t, d]) => <div key={t} className="rounded-2xl border border-white/15 bg-white/5 p-6"><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-slate-300">{d}</p></div>)}</div></div></section>

      <section className="section"><div className="wrap"><Head title="Featured projects" text="Sample projects shown as demonstrations until real client work is added." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.slice(0, 3).map(p => <ProjectCard key={p.slug} p={p} />)}</div>
        <Link to="/portfolio" className="btn-p mt-8">View portfolio</Link></div></section>

      <section className="section dark-sec"><div className="wrap"><Head title="How we build" text="Four steps, each with something you can review." /><Process /></div></section>

      <section className="section"><div className="wrap"><Head title="Technologies we use" text="Practical tools, chosen for the job." /><TechRow items={stack} /></div></section>

      <section className="section pt-0"><div className="wrap">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card grid overflow-hidden !p-0 md:grid-cols-[1fr_1fr]">
            <img src="/A1.jpg" alt="Training and internships" className="h-64 w-full object-cover md:h-full" />
            <div className="p-6"><h2 className="h2">Training and internships</h2><p className="text-slate-600">Hands-on software training and internship programs for people starting careers in technology.</p><Link to="/contact" className="btn-p mt-5">Ask about programs</Link></div>
          </div>
          <div className="card flex items-center"><p className="text-slate-600">“Turning ideas into technology. Building solutions for tomorrow.”</p></div>
        </div></div></section>
      <CTA />
    </>
  )
}
