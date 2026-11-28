import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config, isProd } from './config.js'
import { pool } from './db.js'
import { adminRouter } from './routes/admin.js'
import { publicRouter } from './routes/public.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  if (config.trustProxy) app.set('trust proxy', 1)
  app.use(helmet({ contentSecurityPolicy: config.serveFrontend ? { directives: { 'default-src': ["'self'"], 'img-src': ["'self'", 'data:'], 'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], 'font-src': ["'self'", 'https://fonts.gstatic.com'], 'frame-src': ['https://www.google.com'], 'script-src': ["'self'"], 'connect-src': ["'self'"] } } : undefined }))
  if (config.origins.length) app.use('/api', cors({ origin: config.origins, credentials: true, methods: ['GET', 'POST', 'PATCH'], allowedHeaders: ['Content-Type', 'X-Requested-With'] }))
  app.use(cookieParser())
  app.use(express.json({ limit: '50kb' }))
  app.get('/api/health', async (_req, res) => { try { await pool.query('SELECT 1'); res.json({ ok: true }) } catch { res.status(503).json({ ok: false }) } })
  app.use('/api/internship', publicRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

  if (config.serveFrontend) {
    const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist')
    if (fs.existsSync(dist)) { app.use(express.static(dist, { index: false, maxAge: '1h' })); app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html'))) }
  }
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('[error]', err)
    if (err?.type === 'entity.too.large' || err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid request.' })
    res.status(500).json({ error: isProd ? 'Something went wrong. Please try again.' : String(err?.message || err) })
  })
  return app
}
