import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Briefcase, CheckCircle2, FileText, GraduationCap, Handshake, Info, Laptop, MessageSquareText, Rocket, Sparkles, Users, Building2, Wifi } from 'lucide-react'
import { Reveal, TechLogo } from '../components/ui'
import InternHero from '../components/internship/InternHero'
import ProgramCard from '../components/internship/ProgramCard'
import Roadmap from '../components/internship/Roadmap'
import Faq from '../components/internship/Faq'
import ApplicationForm from '../components/internship/ApplicationForm'
import { useSeo } from '../hooks/useSeo'
import { SITE_URL } from '../data/internshipConfig'
import { approach, careerPoints, deliverables, eligible, faqs, mentorship, modes, programLogos, programs, projectActivities, techCategories, Slug } from '../data/internship'

const SEO_DESC = 'Join Goalings for six-month professional internship training in Software Engineering, Full Stack Development, Web Development, QA Engineering, UI/UX Design, and Digital Marketing. Gain practical experience through project-based learning.'
const Title = ({ eyebrow, title, text, dark }: { eyebrow?: string; title: string; text?: string; dark?: boolean }) => (
  <div className="mb-8 sm:mb-10">{eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wider text-orange">{eyebrow}</p>}
    <h2 className={`max-w-[28ch] text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl ${dark ? 'text-white' : 'text-navy'}`}>{title}</h2>
    {text && <p className={`mt-3 max-w-[64ch] ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>}</div>)
const modeIcon = { online: Wifi, hybrid: Laptop, 'on-site': Building2 } as const

export default function InternshipTraining() {
  const { hash, search } = useLocation()
  const [techTab, setTechTab] = useState<Slug>('software-engineering')
  useSeo({
    title: 'Internship & Professional Training Programs | Goalings', description: SEO_DESC, path: '/internship-training',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Goalings internship & training programs', itemListElement: programs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Course', name: p.title, description: p.description, url: `${SITE_URL}/internship-training/${p.slug}`, timeRequired: 'P6M', provider: { '@type': 'Organization', name: 'Goalings', url: SITE_URL } } })) },
    ],
  })
  // Scroll to #apply / #programs even when arriving from a card on this same page (query string changes)
  useEffect(() => { if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }, [hash, search])

  const relevant = new Set(techCategories.filter(c => c.programs.includes(techTab)).map(c => c.name))
  return (
    <>
      <InternHero />

      {/* 2. About */}
      <section className="section bg-white"><div className="wrap grid items-center gap-10 lg:grid-cols-2">
        <Reveal><div><p className="mb-2 text-sm font-bold uppercase tracking-wider text-orange">About the program</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl md:text-4xl">More Than Training. Real Industry Experience.</h2>
          <p className="mt-4 text-slate-600">At Goalings, we believe that becoming a professional requires more than theoretical knowledge.</p>
          <p className="mt-3 text-slate-600">Our six-month internship program is designed to help students transition from academic learning to professional working environments. Participants will learn modern technologies, work on practical projects, develop problem-solving skills, collaborate with teams, and understand professional software development workflows.</p></div></Reveal>
        <Reveal><div><h3 className="mb-4 font-bold text-navy">Our approach focuses on</h3>
          <ul className="grid gap-3 sm:grid-cols-2">{approach.map(a => <li key={a} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-navy"><CheckCircle2 size={18} className="shrink-0 text-orange" />{a}</li>)}</ul></div></Reveal>
      </div></section>

      {/* 3. Who can apply */}
      <section className="section"><div className="wrap">
        <Title eyebrow="Eligibility" title="Your Journey Starts Here." text="Our internship program welcomes motivated individuals who want to develop their professional technology careers." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{eligible.map((e, i) => <Reveal key={e}><div className="card h-full"><span className="icon mb-3"><GraduationCap size={20} /></span><p className="text-xs font-bold text-orange">0{i + 1}</p><p className="font-semibold text-navy">{e}</p></div></Reveal>)}</div>
        <p className="mt-6 flex gap-3 rounded-2xl border border-orange/30 bg-orange/10 p-5 text-navy"><Info className="mt-0.5 shrink-0 text-orange" size={20} /><span>You do not need extensive professional experience to apply. We welcome individuals who are passionate about technology, willing to learn, and committed to professional development.</span></p>
      </div></section>

      {/* 4. Programs */}
      <section id="programs" className="section scroll-mt-20 bg-white"><div className="wrap">
        <Title eyebrow="Training programs" title="Explore Our Internship & Training Programs" text="Choose your career path and develop industry-relevant skills through structured learning and practical project experience." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">{programs.map((p, i) => <div key={p.slug} className={`${i === 4 ? 'md:col-span-2 lg:col-span-3' : i === 3 ? 'lg:col-span-3' : 'lg:col-span-2'} flex`}><div className="w-full"><ProgramCard p={p} wide={i > 2} /></div></div>)}</div>
      </div></section>

      {/* 5. Roadmap */}
      <section id="roadmap" className="section scroll-mt-20 bg-navy-2 text-white" style={{ background: 'linear-gradient(180deg,#0b1f3d,#071B35)' }}><div className="wrap">
        <Title dark eyebrow="Roadmap" title="Your Six-Month Professional Journey." text="A structured six-month learning and development experience designed to build technical confidence and practical industry knowledge." />
        <Roadmap />
      </div></section>

      {/* 6. Real-world projects */}
      <section className="section bg-white"><div className="wrap">
        <Title eyebrow="Project-based learning" title="Don't Just Learn. Build Real Products." text="At Goalings, practical experience is an important part of the training process. Interns participate in supervised development activities and work on assigned project modules based on their specialization." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{projectActivities.map((a, i) => <motion.li key={a} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-navy"><Rocket size={18} className="shrink-0 text-orange" />{a}</motion.li>)}</ul>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <p className="rounded-2xl border border-slate-200 p-5 text-slate-600"><strong className="text-navy">Professional practices.</strong> Gain experience working with professional development practices such as version control, code review where applicable, testing and documentation.</p>
          <p className="rounded-2xl border border-slate-200 p-5 text-slate-600"><strong className="text-navy">Where applicable,</strong> interns may contribute to internal products, training projects, or approved company projects under appropriate supervision. Access to confidential client systems or production environments is not part of the program.</p>
        </div>
      </div></section>

      {/* 7. Training modes */}
      <section className="section"><div className="wrap">
        <Title eyebrow="Training modes" title="Flexible Learning. Real Industry Experience." />
        <div className="grid gap-5 md:grid-cols-3">{modes.map(m => { const I = modeIcon[m.key]; return <Reveal key={m.key}><div className="card h-full"><span className="icon mb-4 h-14 w-14"><I size={26} /></span><h3 className="text-lg font-bold text-navy">{m.title}</h3><p className="mt-2 text-sm text-slate-600">{m.text}</p></div></Reveal> })}</div>
      </div></section>

      {/* 8. AI-powered technology environment */}
      <section className="section dark-sec"><div className="wrap">
        <Title dark eyebrow="Technology environment" title="Learn With Modern Industry Technologies." text="Goalings embraces modern software engineering practices and AI-driven development approaches. Our programs introduce participants to relevant current technologies and tools. Choose a program to see what applies to it." />
        <div role="tablist" aria-label="Choose a program" className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">{programs.map(p => <button key={p.slug} role="tab" aria-selected={techTab === p.slug} onClick={() => setTechTab(p.slug)} className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-bold transition ${techTab === p.slug ? 'border-orange bg-orange text-navy' : 'border-white/25 hover:border-orange'}`}>{p.formLabel}</button>)}</div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{techCategories.map((c, i) => { const on = relevant.has(c.name); return (
          <motion.li key={c.name} animate={on ? { y: [0, -5, 0] } : { y: 0 }} transition={{ duration: 4 + (i % 3), repeat: on ? Infinity : 0, ease: 'easeInOut' }} className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition duration-300 ${on ? 'border-orange/60 bg-white/10 text-white shadow-lg shadow-orange/10' : 'border-white/10 bg-white/[.03] text-slate-500'}`}>
            <Sparkles size={18} className={on ? 'text-orange' : 'text-slate-600'} />{c.name}{on && <span className="sr-only"> (relevant to this program)</span>}</motion.li>) })}</ul>
        {programLogos[techTab].length > 0 && <ul className="mt-6 flex flex-wrap gap-3">{programLogos[techTab].map(n => <li key={n} className="grid h-14 w-14 place-items-center rounded-xl bg-white"><TechLogo name={n} className="h-8 w-8" /></li>)}</ul>}
        <p className="mt-5 text-sm text-slate-400">Not every technology is covered in every specialization.</p>
      </div></section>

      {/* 9. Mentorship */}
      <section className="section bg-white"><div className="wrap">
        <Title eyebrow="Mentorship" title="Learn, Collaborate, and Grow With Professional Guidance." text="Throughout the program, participants receive guidance to develop their technical abilities and professional working practices." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mentorship.map((m, i) => <Reveal key={m}><li className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"><span className="icon shrink-0">{[Users, Handshake, MessageSquareText][i % 3] && (i % 3 === 0 ? <Users size={20} /> : i % 3 === 1 ? <Handshake size={20} /> : <MessageSquareText size={20} />)}</span><span className="font-semibold text-navy">{m}</span></li></Reveal>)}</ul>
      </div></section>

      {/* 10. Career opportunities */}
      <section className="section"><div className="wrap grid items-center gap-8 lg:grid-cols-2">
        <div><Title eyebrow="Career opportunities at Goalings" title="Your Performance Can Open New Doors." text="At Goalings, we value talent, dedication, professional growth, and continuous learning. Participants who demonstrate strong technical abilities, professional commitment, teamwork, and consistent performance throughout the internship may be considered for suitable employment opportunities within Goalings." />
          <p className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><Info size={18} className="mt-0.5 shrink-0 text-orange" />Permanent employment is not guaranteed to every intern.</p></div>
        <ul className="space-y-3">{careerPoints.map(c => <Reveal key={c}><li className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="icon shrink-0"><Briefcase size={20} /></span><span className="font-semibold text-navy">{c}</span></li></Reveal>)}</ul>
      </div></section>

      {/* 11. Certificate */}
      <section className="section dark-sec overflow-hidden"><div className="wrap grid items-center gap-10 lg:grid-cols-2">
        <div><Title dark eyebrow="Recognition" title="Your Effort Deserves Recognition." text="Upon successfully completing the six-month internship program and fulfilling the program requirements, participants will receive:" />
          <ul className="space-y-3">{deliverables.map(([t, d]) => <li key={t} className="flex gap-3"><Award size={20} className="mt-0.5 shrink-0 text-orange" /><span><strong>{t}</strong><span className="block text-sm text-slate-300">{d}</span></span></li>)}</ul></div>
        <motion.div initial={{ opacity: 0, rotate: -2, y: 20 }} whileInView={{ opacity: 1, rotate: -1.5, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative mx-auto w-full max-w-lg">
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-orange/20 blur-3xl" />
          <div aria-label="Illustration of the certificate layout" role="img" className="relative rounded-2xl bg-white p-3 shadow-2xl shadow-black/40"><div className="rounded-xl border-2 border-orange/70 p-6 text-center text-navy sm:p-8"><div className="rounded-lg border border-navy/15 px-4 py-6">
            <img src="/goalings-logo.png" alt="" width={1000} height={264} className="mx-auto mb-4 h-9 w-auto" />
            <p className="text-xs font-bold uppercase tracking-[.3em] text-orange">Certificate of Completion</p>
            <p className="mt-4 text-sm text-slate-500">This certifies that</p><div className="mx-auto my-2 h-px w-3/4 bg-slate-300" /><p className="text-sm italic text-slate-400">Recipient name</p>
            <p className="mt-3 text-sm text-slate-500">has successfully completed the Goalings six-month Internship & Professional Training Program</p>
            <div className="mt-6 flex items-end justify-between text-[10px] text-slate-400"><span className="w-20 border-t border-slate-300 pt-1">Date</span><Award size={34} className="text-orange" /><span className="w-20 border-t border-slate-300 pt-1">Authorized signature</span></div></div></div></div>
          <p className="mt-3 text-center text-xs text-slate-400">Illustration of the certificate layout. Not an issued certificate.</p>
        </motion.div>
      </div></section>

      {/* 12. FAQ */}
      <section className="section bg-white"><div className="wrap"><div className="mx-auto mb-8 max-w-3xl"><p className="mb-2 text-sm font-bold uppercase tracking-wider text-orange">FAQ</p><h2 className="text-2xl font-extrabold text-navy sm:text-3xl md:text-4xl">Frequently Asked Questions</h2></div><Faq items={faqs} /></div></section>

      {/* 13. Application form */}
      <section id="apply" className="section scroll-mt-20"><div className="wrap">
        <div className="mx-auto mb-8 max-w-3xl text-center"><p className="mb-2 text-sm font-bold uppercase tracking-wider text-orange">Apply</p><h2 className="text-2xl font-extrabold text-navy sm:text-3xl md:text-4xl">Apply for Your Internship at Goalings.</h2>
          <p className="mt-3 text-slate-600">Take the first step towards your professional career. Complete the application form and tell us about your educational background, interests, and career goals.</p></div>
        <ApplicationForm />
      </div></section>

      {/* 14. Final CTA */}
      <section className="section pt-0"><div className="wrap"><div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-2 to-navy px-5 py-12 text-center text-white sm:px-10 sm:py-16">
        <div className="cta-glow pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-orange/30 blur-3xl" /><div className="cta-glow pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" style={{ animationDelay: '-6s' }} />
        <div className="relative"><FileText className="mx-auto mb-4 text-orange" size={32} />
          <h2 className="mx-auto max-w-[24ch] text-2xl font-extrabold sm:text-3xl md:text-4xl">Your Software Engineering Career Starts Here.</h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-slate-300">Learn modern technologies, gain practical experience, work on meaningful projects, and take the next step towards your professional future with Goalings.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"><a href="#apply" className="btn-p">Apply for Internship <ArrowRight size={18} /></a><a href="#programs" className="btn-g">Explore Training Programs</a></div></div>
      </div></div></section>
    </>)
}
