import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { pool } from '../db.js'
import { applicationSchema, fieldErrors } from '../validation.js'
import { sendAdminNotice, sendApplicantAck } from '../mailer.js'

const PROGRAM_LABELS = { 'software-engineering': 'Software Engineering & Full Stack Development', 'web-development': 'Web Development', 'qa-engineering': 'QA Engineering', 'ui-ux-design': 'UI/UX Design', 'digital-marketing': 'Social Media & Digital Marketing' }
const hmac = s => crypto.createHmac('sha256', config.formTokenSecret).update(s).digest('hex')
const MIN_FILL_MS = 5_000, MAX_AGE_MS = 6 * 3600_000

// Spam protection 1: signed, time-stamped form token (bots that post instantly or replay old tokens are rejected)
const makeToken = () => { const t = String(Date.now()); return `${t}.${hmac(t)}` }
function tokenOk(tok) {
  if (typeof tok !== 'string') return false
  const [t, sig] = tok.split('.'); if (!t || !sig) return false
  const a = Buffer.from(sig), b = Buffer.from(hmac(t)); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  const age = Date.now() - Number(t); return age >= MIN_FILL_MS && age <= MAX_AGE_MS
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.maxCvBytes, files: 1, fields: 40, fieldSize: 20_000 } })
// Spam protection 2: per-IP rate limit
// Only SUCCESSFUL submissions count toward the 5/hour cap, so people fixing form typos are never locked out;
// a separate, much higher cap on every request stops floods.
const submitLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, skipFailedRequests: true, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many applications from this connection. Please try again later.' } })
const floodLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please slow down.' } })
const tokenLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false })

export const publicRouter = Router()
publicRouter.get('/form-token', tokenLimiter, (_req, res) => { res.set('Cache-Control', 'no-store'); res.json({ token: makeToken() }) })

const uploadCv = (req, res, next) => upload.single('cv')(req, res, err => {
  if (!err) return next()
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Please check the form.', fields: { cv: `The CV must be ${Math.round(config.maxCvBytes / 1048576)} MB or smaller` } })
  return res.status(400).json({ error: 'The upload could not be processed.', fields: { cv: 'Upload a valid PDF file' } })
})

publicRouter.post('/applications', floodLimiter, submitLimiter, uploadCv, async (req, res, next) => {
  let savedPath
  try {
    const body = req.body || {}
    // Spam protection 3: honeypot (hidden field humans never fill) + signed timing token
    if (body.company_website) return res.status(400).json({ error: 'Submission rejected.' })
    if (!tokenOk(body.form_token)) return res.status(400).json({ error: 'Your session expired or the form was submitted too quickly. Please wait a moment and try again.', refreshToken: true })

    const parsed = applicationSchema.safeParse(body)
    const fields = parsed.success ? {} : fieldErrors(parsed.error)
    const f = req.file
    if (!f) fields.cv = 'Upload your CV as a PDF'
    else if (f.mimetype !== 'application/pdf' || !/\.pdf$/i.test(f.originalname) || f.buffer.subarray(0, 5).toString('latin1') !== '%PDF-') fields.cv = 'The CV must be a valid PDF file'
    else if (f.size < 1024) fields.cv = 'The CV file looks empty'
    if (Object.keys(fields).length) return res.status(400).json({ error: 'Please check the highlighted fields.', fields })

    const d = parsed.data
    // Store the CV outside any public folder under a random name; the original name is kept only as metadata.
    const now = new Date(); const sub = path.join(String(now.getUTCFullYear()), String(now.getUTCMonth() + 1).padStart(2, '0'))
    await fs.mkdir(path.join(config.uploadDir, sub), { recursive: true, mode: 0o700 })
    const rel = path.join(sub, `${crypto.randomUUID()}.pdf`); savedPath = path.join(config.uploadDir, rel)
    await fs.writeFile(savedPath, f.buffer, { mode: 0o600 })

    const ipHash = crypto.createHash('sha256').update(`${req.ip}|${config.formTokenSecret}`).digest('hex').slice(0, 32)
    const client = await pool.connect(); let row
    try {
      await client.query('BEGIN')
      const ins = await client.query(`INSERT INTO internship_applications
        (full_name,email,phone,whatsapp,country,city,qualification,institution,field_of_study,academic_status,program,training_mode,preferred_start_date,
         previous_experience,technical_skills,programming_knowledge,additional_info,linkedin_url,github_url,portfolio_url,cv_path,cv_original_name,cv_size_bytes,
         motivation,consent_privacy,consent_terms,ip_hash,user_agent)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,true,true,$25,$26) RETURNING id, created_at`,
        [d.full_name, d.email, d.phone, d.whatsapp, d.country, d.city, d.qualification, d.institution, d.field_of_study, d.academic_status, d.program, d.training_mode, d.preferred_start_date,
          d.previous_experience, d.technical_skills, d.programming_knowledge, d.additional_info, d.linkedin_url, d.github_url, d.portfolio_url, rel, f.originalname.slice(0, 200), f.size,
          d.motivation, ipHash, String(req.get('user-agent') || '').slice(0, 300)])
      const id = ins.rows[0].id; const reference = `GL-INT-${String(id).padStart(6, '0')}`
      await client.query('UPDATE internship_applications SET reference=$1 WHERE id=$2', [reference, id])
      await client.query('COMMIT'); row = { id, reference, created_at: ins.rows[0].created_at }
    } catch (e) { await client.query('ROLLBACK'); throw e } finally { client.release() }
    savedPath = undefined // committed: keep the file

    const mailData = { ...d, reference: row.reference, programLabel: PROGRAM_LABELS[d.program] }
    const [ack, adm] = await Promise.all([sendApplicantAck(mailData), sendAdminNotice(mailData)])
    await pool.query('UPDATE internship_applications SET ack_email_status=$1, admin_email_status=$2 WHERE id=$3', [ack, adm, row.id])
    res.status(201).json({ ok: true, reference: row.reference, submittedAt: row.created_at })
  } catch (e) {
    if (savedPath) fs.unlink(savedPath).catch(() => {})
    next(e)
  }
})
