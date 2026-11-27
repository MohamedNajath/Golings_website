import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, MapPin } from 'lucide-react'
import { CTA, Head, PageHero, Reveal } from '../components/ui'
import TeamSlider from '../components/TeamSlider'
import { jobs, perks, team } from '../data/careers'

export default function Careers() {
  return (
    <>
      <PageHero title="Build your career with Goalings" text="Join a focused team that designs and delivers software people rely on. We hire curious builders and train the next generation of developers.">
        <div className="flex flex-wrap gap-4"><a href="#openings" className="btn-p">See open roles</a><Link to="/contact" className="btn-g">Send your CV</Link></div>
      </PageHero>

      <section className="section"><div className="wrap"><Head title="Why work with us" text="Small team, real responsibility, and room to grow." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{perks.map(([t, d]) => <Reveal key={t}><div className="card h-full"><h3 className="font-bold text-navy">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div></Reveal>)}</div></div></section>

      <section className="section dark-sec overflow-hidden"><div className="wrap"><Head title="Meet our team" text="The people behind every project. Swipe, scroll or use the arrows." />
        <TeamSlider members={team} /></div></section>

      <section id="openings" className="section scroll-mt-20"><div className="wrap"><Head title="Open positions" text="Don’t see a perfect fit? Send us your CV anyway." />
        <div className="grid gap-5 md:grid-cols-2">{jobs.map(j => (
          <Reveal key={j.slug}><article className="card flex h-full flex-col">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-orange"><span className="inline-flex items-center gap-1"><Briefcase size={14} />{j.type}</span><span className="inline-flex items-center gap-1 text-slate-500"><MapPin size={14} />{j.location}</span></div>
            <h3 className="mt-2 text-xl font-bold text-navy">{j.title}</h3><p className="mt-1 text-sm text-slate-600">{j.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{j.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
            <Link to={`/contact?role=${j.slug}`} className="mt-5 inline-flex items-center gap-1 font-bold text-navy hover:text-orange">Apply now <ArrowRight size={16} /></Link></article></Reveal>))}</div></div></section>

      <section className="section dark-sec"><div className="wrap"><Head title="Our hiring process" text="Simple, transparent and respectful of your time." /><ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{[['Apply', 'Send your CV or portfolio.'], ['Intro call', 'A friendly chat about you and the role.'], ['Skills review', 'A practical task or portfolio walkthrough.'], ['Offer', 'Decision within days, then onboarding.']].map(([t, d], i) => <li key={t} className="rounded-2xl border border-white/15 bg-white/5 p-6"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange font-extrabold text-navy">{i + 1}</span><h3 className="mt-3 font-bold">{t}</h3><p className="mt-1 text-sm text-slate-300">{d}</p></li>)}</ol></div></section>
      <CTA />
    </>
  )
}
