import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react'
import { api, ApiError } from '../../lib/api'
import { MAX_CV_MB } from '../../data/internshipConfig'
import { programs } from '../../data/internship'

const phone = (label: string) => z.string().trim().min(1, `${label} is required`).regex(/^\+?[0-9\s\-().]{7,22}$/, `Enter a valid ${label.toLowerCase()}`)
  .refine(v => { const d = v.replace(/\D/g, '').length; return d >= 7 && d <= 15 }, `Enter a valid ${label.toLowerCase()}`)
const url = (host: string | null, label: string) => z.string().trim().optional().refine(v => {
  if (!v) return true
  try { const u = new URL(v); return ['http:', 'https:'].includes(u.protocol) && (!host || u.hostname.toLowerCase().endsWith(host)) } catch { return false }
}, `Enter a valid ${label} URL${host ? ` (${host})` : ''}`)
const req = (label: string, min = 2) => z.string().trim().min(min, `${label} is required`)

const schema = z.object({
  full_name: req('Full name'), email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: phone('Phone number'), whatsapp: phone('WhatsApp number'), country: req('Country'), city: req('City'),
  qualification: z.string().min(1, 'Choose your qualification'), institution: req('University / institute'), field_of_study: req('Field of study'), academic_status: z.string().min(1, 'Choose your academic status'),
  program: z.string().min(1, 'Choose a training program'), training_mode: z.string().min(1, 'Choose a training mode'),
  preferred_start_date: z.string().optional(), previous_experience: z.string().max(2000).optional(), technical_skills: z.string().max(2000).optional(), programming_knowledge: z.string().max(2000).optional(), additional_info: z.string().max(2000).optional(),
  linkedin_url: url('linkedin.com', 'LinkedIn'), github_url: url('github.com', 'GitHub'), portfolio_url: url(null, 'portfolio'),
  motivation: z.string().trim().min(30, 'Please write at least 30 characters').max(3000, 'Please keep it under 3000 characters'),
  consent_privacy: z.boolean().refine(v => v, 'You must accept the Privacy Policy'), consent_terms: z.boolean().refine(v => v, 'You must accept the Terms and Conditions'),
})
type FormValues = z.infer<typeof schema>

const Err = ({ m }: { m?: string }) => m ? <p role="alert" className="mt-1 flex items-center gap-1 text-sm text-red-600"><AlertCircle size={14} />{m}</p> : null
const Field = ({ id, label, error, children, hint, className = '' }: { id: string; label: string; error?: string; children: ReactNode; hint?: string; className?: string }) => (
  <div className={className}><label htmlFor={id} className="mb-1 block text-sm font-bold text-navy">{label}</label>{children}{hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}<Err m={error} /></div>)
const Section = ({ n, title, children }: { n: string; title: string; children: ReactNode }) => (
  <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><legend className="-ml-1 flex items-center gap-3 px-1 text-lg font-extrabold text-navy"><span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-sm text-orange">{n}</span>{title}</legend>
    <div className="mt-4 grid gap-5 sm:grid-cols-2">{children}</div></fieldset>)
const today = () => new Date().toISOString().slice(0, 10)

export default function ApplicationForm() {
  const [params] = useSearchParams()
  const { register, handleSubmit, setValue, setError, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { consent_privacy: false, consent_terms: false } })
  const [cv, setCv] = useState<File | null>(null); const [cvErr, setCvErr] = useState('')
  const [token, setToken] = useState(''); const [tokenErr, setTokenErr] = useState(false)
  const [banner, setBanner] = useState(''); const [done, setDone] = useState<{ reference: string } | null>(null)
  const topRef = useRef<HTMLFormElement & HTMLDivElement>(null)

  const loadToken = useCallback(async () => {
    try { const r = await api<{ token: string }>('/api/internship/form-token'); setToken(r.token); setTokenErr(false) } catch { setTokenErr(true) }
  }, [])
  useEffect(() => { loadToken() }, [loadToken])

  // "Apply Now" on a program card → /internship-training?program=slug#apply → preselect that program
  const wanted = params.get('program')
  useEffect(() => { if (wanted && programs.some(p => p.slug === wanted)) setValue('program', wanted, { shouldValidate: false }) }, [wanted, setValue])

  const pickFile = (f: File | null) => {
    setCvErr(''); if (!f) { setCv(null); return }
    if (f.type !== 'application/pdf' && !/\.pdf$/i.test(f.name)) { setCv(null); return setCvErr('Please upload your CV as a PDF file.') }
    if (f.size > MAX_CV_MB * 1048576) { setCv(null); return setCvErr(`The CV must be ${MAX_CV_MB} MB or smaller.`) }
    setCv(f)
  }

  const onSubmit = async (v: FormValues) => {
    setBanner(''); if (!cv) { setCvErr('Upload your CV as a PDF.'); return document.getElementById('cv')?.focus() }
    const fd = new FormData()
    Object.entries(v).forEach(([k, val]) => fd.append(k, typeof val === 'boolean' ? String(val) : (val ?? '')))
    fd.append('cv', cv); fd.append('form_token', token); fd.append('company_website', (document.getElementById('company_website') as HTMLInputElement)?.value ?? '')
    try {
      const r = await api<{ reference: string }>('/api/internship/applications', { method: 'POST', body: fd })
      setDone({ reference: r.reference }); reset(); setCv(null); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch (e) {
      const err = e as ApiError
      if (err.fields) Object.entries(err.fields).forEach(([k, m]) => k === 'cv' ? setCvErr(m) : setError(k as keyof FormValues, { message: m }))
      setBanner(err.message); if (err.refreshToken || err.status === 400) loadToken()
    }
  }
  const onInvalid = () => { setBanner('Please correct the highlighted fields and try again.'); if (!cv) setCvErr('Upload your CV as a PDF.') }

  if (done) return (
    <div ref={topRef} role="status" className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg sm:p-12">
      <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={36} /></span>
      <h3 className="text-2xl font-extrabold text-navy">Application submitted</h3>
      <p className="mt-3 text-slate-600">Thank you for applying to the Goalings Internship Program. Your application has been submitted successfully. Our team will review your application and contact you regarding the next steps.</p>
      <p className="mt-5 inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">Your reference: <strong className="text-navy">{done.reference}</strong></p>
      <div className="mt-6"><button onClick={() => { setDone(null); loadToken() }} className="font-bold text-navy underline-offset-4 hover:text-orange hover:underline">Submit another application</button></div>
    </div>)

  const inp = (n: keyof FormValues) => ({ id: n, 'aria-invalid': !!errors[n], ...register(n) } as any)
  return (
    <form ref={topRef} onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="mx-auto max-w-4xl space-y-6" aria-label="Internship application form">
      {tokenErr && <p role="alert" className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle size={18} className="mt-0.5 shrink-0" />The application service is not reachable right now, so applications cannot be submitted. Please try again shortly or <button type="button" onClick={loadToken} className="font-bold underline">retry</button>.</p>}
      {banner && <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" />{banner}</p>}

      <Section n="A" title="Personal information">
        <Field id="full_name" label="Full name *" error={errors.full_name?.message}><input className="field" autoComplete="name" {...inp('full_name')} /></Field>
        <Field id="email" label="Email address *" error={errors.email?.message}><input type="email" className="field" autoComplete="email" {...inp('email')} /></Field>
        <Field id="phone" label="Phone number *" error={errors.phone?.message}><input type="tel" className="field" autoComplete="tel" placeholder="+974 5512 3456" {...inp('phone')} /></Field>
        <Field id="whatsapp" label="WhatsApp number *" error={errors.whatsapp?.message}><input type="tel" className="field" {...inp('whatsapp')} /></Field>
        <Field id="country" label="Country *" error={errors.country?.message}><input className="field" autoComplete="country-name" {...inp('country')} /></Field>
        <Field id="city" label="City *" error={errors.city?.message}><input className="field" autoComplete="address-level2" {...inp('city')} /></Field>
      </Section>

      <Section n="B" title="Educational information">
        <Field id="qualification" label="Educational qualification *" error={errors.qualification?.message}><select className="field" defaultValue="" {...inp('qualification')}><option value="" disabled>Select one</option><option value="degree">Degree</option><option value="higher_diploma">Higher Diploma</option><option value="diploma">Diploma</option><option value="other">Other</option></select></Field>
        <Field id="academic_status" label="Academic status *" error={errors.academic_status?.message}><select className="field" defaultValue="" {...inp('academic_status')}><option value="" disabled>Select one</option><option value="final_year_student">Final-Year Student</option><option value="recently_graduated">Recently Graduated</option><option value="degree_completed">Degree Completed</option><option value="diploma_completed">Diploma Completed</option><option value="other">Other</option></select></Field>
        <Field id="institution" label="University / institute name *" error={errors.institution?.message}><input className="field" {...inp('institution')} /></Field>
        <Field id="field_of_study" label="Field of study *" error={errors.field_of_study?.message}><input className="field" {...inp('field_of_study')} /></Field>
      </Section>

      <Section n="C" title="Training program">
        <Field id="program" label="Training program *" error={errors.program?.message}><select className="field" defaultValue="" {...inp('program')}><option value="" disabled>Select a program</option>{programs.map(p => <option key={p.slug} value={p.slug}>{p.formLabel}</option>)}</select></Field>
        <Field id="training_mode" label="Training mode *" error={errors.training_mode?.message}><select className="field" defaultValue="" {...inp('training_mode')}><option value="" disabled>Select one</option><option value="online">Online</option><option value="hybrid">Hybrid</option><option value="on-site">On-site</option></select></Field>
        <Field id="preferred_start_date" label="Preferred starting date" error={errors.preferred_start_date?.message}><input type="date" min={today()} className="field" {...inp('preferred_start_date')} /></Field>
        <Field id="programming_knowledge" label="Programming knowledge" error={errors.programming_knowledge?.message}><input className="field" placeholder="e.g. Java basics, HTML/CSS" {...inp('programming_knowledge')} /></Field>
        <Field id="technical_skills" label="Technical skills" className="sm:col-span-2"><textarea rows={2} className="field" {...inp('technical_skills')} /></Field>
        <Field id="previous_experience" label="Previous experience" className="sm:col-span-2"><textarea rows={3} className="field" {...inp('previous_experience')} /></Field>
        <Field id="additional_info" label="Additional information" className="sm:col-span-2"><textarea rows={3} className="field" {...inp('additional_info')} /></Field>
      </Section>

      <Section n="D" title="Professional information">
        <Field id="linkedin_url" label="LinkedIn profile" error={errors.linkedin_url?.message}><input type="url" className="field" placeholder="https://www.linkedin.com/in/…" {...inp('linkedin_url')} /></Field>
        <Field id="github_url" label="GitHub profile" error={errors.github_url?.message}><input type="url" className="field" placeholder="https://github.com/…" {...inp('github_url')} /></Field>
        <Field id="portfolio_url" label="Portfolio website" error={errors.portfolio_url?.message} className="sm:col-span-2"><input type="url" className="field" placeholder="https://…" {...inp('portfolio_url')} /></Field>
        <div className="sm:col-span-2">
          <label htmlFor="cv" className="mb-1 block text-sm font-bold text-navy">Upload CV / resume (PDF) *</label>
          <label htmlFor="cv" className={`flex min-h-[72px] cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition hover:border-orange ${cvErr ? 'border-red-400 bg-red-50' : cv ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-orange">{cv ? <FileText size={20} /> : <Upload size={20} />}</span>
            <span className="min-w-0 text-sm"><span className="block truncate font-bold text-navy">{cv ? cv.name : 'Choose a PDF file'}</span><span className="text-slate-500">{cv ? `${(cv.size / 1048576).toFixed(2)} MB` : `PDF only, up to ${MAX_CV_MB} MB`}</span></span>
          </label>
          <input id="cv" type="file" accept="application/pdf,.pdf" className="sr-only" onChange={e => pickFile(e.target.files?.[0] ?? null)} aria-invalid={!!cvErr} />
          <Err m={cvErr} />
        </div>
      </Section>

      <Section n="E" title="Additional questions">
        <Field id="motivation" label="Why do you want to join the Goalings Internship Program? *" error={errors.motivation?.message} className="sm:col-span-2"><textarea rows={5} className="field" {...inp('motivation')} /></Field>
        <div className="space-y-3 sm:col-span-2">
          <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-orange" {...inp('consent_privacy')} /><span>I have read and accept the <a href="/privacy-policy" target="_blank" rel="noopener" className="font-bold text-navy underline hover:text-orange">Privacy Policy</a>. *</span></label><Err m={errors.consent_privacy?.message} /></div>
          <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-orange" {...inp('consent_terms')} /><span>I accept the <a href="/terms-and-conditions" target="_blank" rel="noopener" className="font-bold text-navy underline hover:text-orange">Terms and Conditions</a>. *</span></label><Err m={errors.consent_terms?.message} /></div>
        </div>
      </Section>

      {/* honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label htmlFor="company_website">Company website</label><input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" /></div>

      <div className="flex flex-col items-center gap-3">
        <button type="submit" disabled={isSubmitting || tokenErr} className="btn-p w-full sm:w-auto sm:min-w-[260px] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : 'Submit Application'}</button>
        <p className="text-xs text-slate-500">Fields marked * are required.</p>
      </div>
    </form>)
}
