import { z } from 'zod'

export const PROGRAMS = ['software-engineering', 'web-development', 'qa-engineering', 'ui-ux-design', 'digital-marketing']
export const MODES = ['online', 'hybrid', 'on-site']
export const QUALIFICATIONS = ['degree', 'higher_diploma', 'diploma', 'other']
export const ACADEMIC = ['final_year_student', 'recently_graduated', 'degree_completed', 'diploma_completed', 'other']
export const STATUSES = ['pending', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected']

const txt = (min, max, label) => z.string({ required_error: `${label} is required` }).trim().min(min, `${label} is required`).max(max, `${label} is too long`)
const opt = max => z.string().trim().max(max, 'Too long').optional().transform(v => v || null)
const phone = label => z.string({ required_error: `${label} is required` }).trim().regex(/^\+?[0-9\s\-().]{7,22}$/, `Enter a valid ${label.toLowerCase()} (digits, spaces, +, -)`)
  .refine(v => { const d = v.replace(/\D/g, '').length; return d >= 7 && d <= 15 }, `Enter a valid ${label.toLowerCase()}`)
const url = (host, label) => z.string().trim().max(300).optional().transform(v => v || null).refine(v => {
  if (!v) return true
  try { const u = new URL(v); return ['http:', 'https:'].includes(u.protocol) && (!host || u.hostname.toLowerCase().endsWith(host)) } catch { return false }
}, `Enter a valid ${label} URL${host ? ` (${host})` : ''}`)

export const applicationSchema = z.object({
  full_name: txt(2, 120, 'Full name'),
  email: z.string({ required_error: 'Email is required' }).trim().toLowerCase().email('Enter a valid email address').max(200),
  phone: phone('Phone number'),
  whatsapp: phone('WhatsApp number'),
  country: txt(2, 80, 'Country'),
  city: txt(2, 80, 'City'),
  qualification: z.enum(QUALIFICATIONS, { errorMap: () => ({ message: 'Choose your qualification' }) }),
  institution: txt(2, 200, 'University / institute'),
  field_of_study: txt(2, 150, 'Field of study'),
  academic_status: z.enum(ACADEMIC, { errorMap: () => ({ message: 'Choose your academic status' }) }),
  program: z.enum(PROGRAMS, { errorMap: () => ({ message: 'Choose a training program' }) }),
  training_mode: z.enum(MODES, { errorMap: () => ({ message: 'Choose a training mode' }) }),
  preferred_start_date: z.string().trim().optional().transform(v => v || null).refine(v => {
    if (!v) return true
    const d = new Date(v + 'T00:00:00Z'); const today = new Date(); today.setUTCHours(0, 0, 0, 0)
    return !isNaN(d) && d >= today && d <= new Date(today.getTime() + 366 * 864e5)
  }, 'Pick a date from today up to one year ahead'),
  previous_experience: opt(2000), technical_skills: opt(2000), programming_knowledge: opt(2000), additional_info: opt(2000),
  linkedin_url: url('linkedin.com', 'LinkedIn'), github_url: url('github.com', 'GitHub'), portfolio_url: url(null, 'portfolio'),
  motivation: txt(30, 3000, 'Your answer').refine(v => v.length >= 30, 'Please write at least 30 characters'),
  consent_privacy: z.literal('true', { errorMap: () => ({ message: 'You must accept the Privacy Policy' }) }),
  consent_terms: z.literal('true', { errorMap: () => ({ message: 'You must accept the Terms and Conditions' }) }),
})

export const adminUpdateSchema = z.object({
  status: z.enum(STATUSES).optional(),
  interview_at: z.string().datetime({ offset: true }).nullable().optional(),
  evaluation_feedback: z.string().trim().max(4000).nullable().optional(),
}).refine(o => Object.keys(o).length > 0, 'Nothing to update')
export const noteSchema = z.object({ note: z.string().trim().min(1, 'Write a note').max(4000) })
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) })

export const fieldErrors = err => Object.fromEntries(err.issues.map(i => [i.path.join('.') || 'form', i.message]))
