import { Compass, Eye, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react'
import TeamSlider from '../components/TeamSlider'
import { team } from '../data/careers'
import { CTA, Head, PageHero, Reveal, TechRow } from '../components/ui'

const values = [[Sparkles, 'Innovation', 'We look for better ways to solve problems.'], [ShieldCheck, 'Reliability', 'We deliver what we promise.'], [Users, 'Collaboration', 'We work with you, not just for you.'], [Heart, 'Craft', 'We care about the details users feel.']] as const

export default function About() {
  return (
    <>
      <PageHero title="About Goalings" text="A software development and IT solutions company helping businesses grow, automate and succeed in the digital world." />
      <section className="section"><div className="wrap grid gap-8 md:gap-10 md:grid-cols-2">
        <Reveal><Head title="Our story" /><p className="text-slate-600">At Goalings, we are passionate about helping businesses transform their ideas into innovative digital experiences. Our team of skilled developers, designers, AI engineers, and technology consultants works together to create custom software, modern websites, mobile applications, and AI-powered solutions tailored to each client's unique goals. We believe technology should simplify business, improve efficiency, and create opportunities for growth. By combining creativity, technical expertise, and the latest innovations in Artificial Intelligence, we deliver secure, scalable, and high-performance solutions that empower businesses to succeed in today's digital world. From startups to enterprises, Goalings is committed to building long-term partnerships through quality, transparency, and exceptional service. {/* TODO: replace with your real company story */}</p></Reveal>
        <Reveal><div className="card"><Compass className="text-orange" /><h3 className="mt-3 text-xl font-bold text-navy">Our mission</h3><p className="text-slate-600">Deliver innovative technology solutions that empower businesses through creativity, quality, and continuous improvement.</p></div>
          <div className="card mt-5"><Eye className="text-orange" /><h3 className="mt-3 text-xl font-bold text-navy">Our vision</h3><p className="text-slate-600">To become a globally trusted technology company that drives digital transformation through innovation and excellence.</p></div></Reveal></div></section>
      <section className="section dark-sec"><div className="wrap"><Head title="Our values" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{values.map(([I, t, d]) => <div key={t} className="rounded-2xl border border-white/15 bg-white/5 p-6"><I className="text-orange" /><h3 className="mt-3 font-bold">{t}</h3><p className="mt-1 text-sm text-slate-300">{d}</p></div>)}</div></div></section>
      <section className="section"><div className="wrap"><Head title="Why Goalings" text="Custom work, clear communication, modern technology and support after launch." />
        <h3 className="mb-3 font-bold text-navy">Our expertise</h3><p className="mb-6 text-slate-600">Custom software, web applications, websites, UI/UX and graphic design, IT consulting, training and maintenance.</p>
        <h3 className="mb-3 font-bold text-navy">Technologies and tools</h3><TechRow items={['React', 'Angular', 'JavaScript', 'Node.js', 'Java Spring Boot', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'MySQL', 'Figma']} /></div></section>
      <section className="section dark-sec overflow-hidden"><div className="wrap"><Head title="Meet our team" text="The people behind every project. Swipe, scroll or use the arrows." />
        <TeamSlider members={team} /></div></section>
      <CTA />
    </>
  )
}
