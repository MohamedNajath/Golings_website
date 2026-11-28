import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { config, isProd } from '../config.js'
import { pool, q } from '../db.js'
import { ACADEMIC, MODES, PROGRAMS, STATUSES, adminUpdateSchema, fieldErrors, loginSchema, noteSchema } from '../validation.js'

const COOKIE = 'gl_admin'
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12) // equalises timing for unknown emails
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many sign-in attempts. Try again in 15 minutes.' } })

export const adminRouter = Router()
adminRouter.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next() })

adminRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const p = loginSchema.safeParse(req.body); if (!p.success) return res.status(400).json({ error: 'Enter your email and password.' })
    const { rows } = await q('SELECT id,email,role,password_hash FROM admin_users WHERE email=$1', [p.data.email])
    const u = rows[0]; const ok = await bcrypt.compare(p.data.password, u?.password_hash ?? DUMMY_HASH)
    if (!u || !ok) return res.status(401).json({ error: 'Incorrect email or password.' })
    await q('UPDATE admin_users SET last_login_at=now() WHERE id=$1', [u.id])
    const token = jwt.sign({ sub: String(u.id) }, config.jwtSecret, { expiresIn: '8h', issuer: 'goalings-api' })
    res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: isProd, path: '/api', maxAge: 8 * 3600_000 })
    res.json({ email: u.email, role: u.role })
  } catch (e) { next(e) }
})
adminRouter.post('/logout', (_req, res) => { res.clearCookie(COOKIE, { path: '/api' }); res.json({ ok: true }) })

// Everything below requires a valid session whose user still exists (so removing an admin revokes access immediately).
adminRouter.use(async (req, res, next) => {
  try {
    const t = req.cookies?.[COOKIE]; if (!t) return res.status(401).json({ error: 'Authentication required.' })
    const { sub } = jwt.verify(t, config.jwtSecret, { issuer: 'goalings-api' })
    const { rows } = await q('SELECT id,email,role FROM admin_users WHERE id=$1', [sub])
    if (!rows[0]) return res.status(401).json({ error: 'Authentication required.' })
    req.admin = rows[0]; next()
  } catch { res.status(401).json({ error: 'Authentication required.' }) }
})
const needAdmin = (req, res, next) => {
  if (req.admin.role !== 'admin') return res.status(403).json({ error: 'Your account is read-only.' })
  if (req.get('x-requested-with') !== 'goalings-admin') return res.status(403).json({ error: 'Invalid request.' }) // CSRF defence in depth (cookie is also SameSite=Strict)
  next()
}
adminRouter.get('/me', (req, res) => res.json({ email: req.admin.email, role: req.admin.role }))

const LIST_COLS = 'id,reference,full_name,email,phone,program,training_mode,academic_status,qualification,institution,status,interview_at,created_at'
const esc = s => s.replace(/[\\%_]/g, c => '\\' + c)

adminRouter.get('/applications', async (req, res, next) => {
  try {
    const { q: search, program, status, academic_status, training_mode } = req.query
    const where = [], args = []; const add = (sql, v) => { args.push(v); where.push(sql.replace('?', '$' + args.length)) }
    if (program) { if (!PROGRAMS.includes(program)) return res.status(400).json({ error: 'Invalid program filter' }); add('program = ?', program) }
    if (status) { if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status filter' }); add('status = ?', status) }
    if (academic_status) { if (!ACADEMIC.includes(academic_status)) return res.status(400).json({ error: 'Invalid filter' }); add('academic_status = ?', academic_status) }
    if (training_mode) { if (!MODES.includes(training_mode)) return res.status(400).json({ error: 'Invalid filter' }); add('training_mode = ?', training_mode) }
    if (search) { const s = `%${esc(String(search).slice(0, 100))}%`; args.push(s); const n = '$' + args.length
      where.push(`(full_name ILIKE ${n} OR email ILIKE ${n} OR reference ILIKE ${n} OR institution ILIKE ${n} OR phone ILIKE ${n})`) }
    const w = where.length ? 'WHERE ' + where.join(' AND ') : ''
    const page = Math.max(1, parseInt(req.query.page) || 1), size = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 20))
    const [items, total] = await Promise.all([
      q(`SELECT ${LIST_COLS} FROM internship_applications ${w} ORDER BY created_at DESC, id DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, args),
      q(`SELECT count(*)::int AS n FROM internship_applications ${w}`, args)])
    res.json({ items: items.rows, total: total.rows[0].n, page, pageSize: size })
  } catch (e) { next(e) }
})

adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [t, p, m] = await Promise.all([
      q(`SELECT count(*)::int total, count(*) FILTER (WHERE status='pending')::int pending, count(*) FILTER (WHERE status='under_review')::int under_review,
          count(*) FILTER (WHERE status='shortlisted')::int shortlisted, count(*) FILTER (WHERE status='interview_scheduled')::int interview_scheduled,
          count(*) FILTER (WHERE status='accepted')::int accepted, count(*) FILTER (WHERE status='rejected')::int rejected FROM internship_applications`),
      q('SELECT program k, count(*)::int n FROM internship_applications GROUP BY program ORDER BY n DESC'),
      q('SELECT training_mode k, count(*)::int n FROM internship_applications GROUP BY training_mode ORDER BY n DESC')])
    res.json({ ...t.rows[0], byProgram: p.rows, byMode: m.rows })
  } catch (e) { next(e) }
})

const idParam = (req, res, next) => { if (!/^\d{1,18}$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' }); next() }

adminRouter.get('/applications/:id', idParam, async (req, res, next) => {
  try {
    const { rows } = await q('SELECT * FROM internship_applications WHERE id=$1', [req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    const { cv_path, ip_hash, user_agent, ...app } = rows[0]
    const notes = (await q('SELECT id,author_email,note,created_at FROM internship_notes WHERE application_id=$1 ORDER BY created_at DESC, id DESC', [req.params.id])).rows
    res.json({ ...app, notes })
  } catch (e) { next(e) }
})

adminRouter.patch('/applications/:id', idParam, needAdmin, async (req, res, next) => {
  try {
    const p = adminUpdateSchema.safeParse(req.body); if (!p.success) return res.status(400).json({ error: 'Invalid update', fields: fieldErrors(p.error) })
    const sets = [], args = []; const add = (c, v) => { args.push(v); sets.push(`${c}=$${args.length}`) }
    const d = p.data
    if (d.status !== undefined) { add('status', d.status); add('status_updated_at', new Date()); add('status_updated_by', req.admin.email) }
    if (d.interview_at !== undefined) add('interview_at', d.interview_at)
    if (d.evaluation_feedback !== undefined) add('evaluation_feedback', d.evaluation_feedback || null)
    add('updated_at', new Date()); args.push(req.params.id)
    const { rows } = await q(`UPDATE internship_applications SET ${sets.join(',')} WHERE id=$${args.length} RETURNING id,status,interview_at,evaluation_feedback,status_updated_at,status_updated_by`, args)
    if (!rows[0]) return res.status(404).json({ error: 'Not found' }); res.json(rows[0])
  } catch (e) { next(e) }
})

adminRouter.post('/applications/:id/notes', idParam, needAdmin, async (req, res, next) => {
  try {
    const p = noteSchema.safeParse(req.body); if (!p.success) return res.status(400).json({ error: 'Write a note (max 4000 characters).' })
    const ex = await q('SELECT 1 FROM internship_applications WHERE id=$1', [req.params.id]); if (!ex.rowCount) return res.status(404).json({ error: 'Not found' })
    const { rows } = await q('INSERT INTO internship_notes(application_id,author_email,note) VALUES ($1,$2,$3) RETURNING id,author_email,note,created_at', [req.params.id, req.admin.email, p.data.note])
    res.status(201).json(rows[0])
  } catch (e) { next(e) }
})

adminRouter.get('/applications/:id/cv', idParam, async (req, res, next) => {
  try {
    const { rows } = await q('SELECT reference,full_name,cv_path FROM internship_applications WHERE id=$1', [req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    const full = path.resolve(config.uploadDir, rows[0].cv_path)
    if (!full.startsWith(config.uploadDir + path.sep) || !fs.existsSync(full)) return res.status(404).json({ error: 'CV file not found' })
    const safe = rows[0].full_name.normalize('NFKD').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 60) || 'applicant'
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${rows[0].reference}_${safe}_CV.pdf"`, 'X-Content-Type-Options': 'nosniff' })
    fs.createReadStream(full).on('error', next).pipe(res)
  } catch (e) { next(e) }
})
