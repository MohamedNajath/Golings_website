import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { PageHero, Reveal } from '../components/ui'
import SocialLinks from '../components/Social'
import { company, mapsEmbedSrc, mapsSearchUrl, telHref } from '../data/company'

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
  interest: z.string().min(1, 'Choose a topic'),
  message: z.string().min(10, 'Tell us a little more (10+ characters)'),
})
type Form = z.infer<typeof schema>

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [params] = useSearchParams()
  const role = params.get('role')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: Form) => {
    // TODO: connect to your Spring Boot endpoint, e.g.
    // await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    console.log(data); setSent(true); reset()
  }
  const Err = ({ m }: { m?: string }) => m ? <p role="alert" className="mt-1 text-sm text-red-600">{m}</p> : null
  return (
    <>
      <PageHero title="Let’s talk" text="Tell us about your project, or ask about training and internships." />
      <section className="section"><div className="wrap grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
        <Reveal><div>
          <h2 className="h2">Get in touch</h2>
          <p className="mb-6 text-slate-600">Visit us, call, or send a message. We usually reply within one working day.</p>
          <ul className="space-y-3">
            {[
              [MapPin, 'Address', <>{company.address.map(l => <span key={l} className="block">{l}</span>)}</>, '#map'],
              [Phone, 'Phone', company.phone, telHref],
              [Mail, 'Email', <span className="break-all">{company.email}</span>, `mailto:${company.email}`],
              [Clock, 'Working hours', company.hours, ''],
            ].map(([Icon, label, value, href]: any) => {
              const inner = <><span className="icon shrink-0"><Icon size={20} /></span><span><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><span className="font-semibold text-navy">{value}</span></span></>
              const cls = 'flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition'
              return <li key={label}>{href ? <a href={href} className={`${cls} hover:border-orange hover:shadow-md`}>{inner}</a> : <div className={cls}>{inner}</div>}</li>
            })}
          </ul>
          <h3 className="mb-3 mt-8 font-bold text-navy">Follow us</h3>
          <SocialLinks tone="light" />
        </div></Reveal>

        <Reveal><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="h2 !mb-1">Send us a message</h2>
          <p className="mb-6 text-slate-600">Tell us about your project, or ask about training and internships.</p>
          {sent && <p role="status" className="mb-6 rounded-lg bg-emerald-50 p-4 text-emerald-800">Message sent. We’ll reply soon.</p>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div><label htmlFor="name" className="mb-1 block font-bold">Name</label><input id="name" className="field" {...register('name')} /><Err m={errors.name?.message} /></div>
            <div><label htmlFor="email" className="mb-1 block font-bold">Email</label><input id="email" type="email" className="field" {...register('email')} /><Err m={errors.email?.message} /></div>
            <div><label htmlFor="interest" className="mb-1 block font-bold">I’m interested in</label>
              <select id="interest" className="field" defaultValue={role ? 'Careers / job application' : ''} {...register('interest')}><option value="" disabled>Select one</option><option>A software project</option><option>Design</option><option>IT consulting</option><option>Training or internship</option><option>Careers / job application</option></select><Err m={errors.interest?.message} /></div>
            <div><label htmlFor="message" className="mb-1 block font-bold">Message</label><textarea id="message" rows={5} className="field" {...register('message')} /><Err m={errors.message?.message} /></div>
            <button className="btn-p w-full sm:w-auto" disabled={isSubmitting}>Send message</button>
          </form></div></Reveal>
      </div></section>

      <section id="map" className="section scroll-mt-20 pt-0"><div className="wrap">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {mapsEmbedSrc
            ? <iframe title="Goalings location map" src={mapsEmbedSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="block h-80 w-full border-0 sm:h-[26rem] lg:h-[30rem]" />
            : <div className="grid h-80 place-items-center bg-gradient-to-br from-navy to-navy-2 p-6 text-center text-white sm:h-[26rem] lg:h-[30rem]"><div><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-orange text-navy"><MapPin size={28} /></span><p className="font-bold">Your map will appear here</p><p className="mx-auto mt-1 max-w-sm text-sm text-slate-300">Add your address to <code className="rounded bg-white/10 px-1.5 py-0.5">src/data/company.ts</code> (mapQuery) to show your location.</p></div></div>}
          <div className="border-t border-slate-200 bg-white p-4 sm:absolute sm:bottom-5 sm:left-5 sm:max-w-xs sm:rounded-2xl sm:border sm:shadow-xl">
            <div className="flex items-start gap-3"><span className="icon shrink-0"><MapPin size={20} /></span><div><p className="font-bold text-navy">Goalings office</p><p className="text-sm text-slate-600">{company.address.join(', ')}</p></div></div>
            <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="btn-p mt-3 w-full !py-2 text-sm"><Navigation size={16} /> Get directions</a>
          </div>
        </div>
      </div></section>
    </>
  )
}
