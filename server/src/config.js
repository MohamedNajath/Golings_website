import 'dotenv/config'
import path from 'node:path'

const env = process.env
const bool = (v, d = false) => (v === undefined || v === '' ? d : ['1', 'true', 'yes'].includes(String(v).toLowerCase()))
export const isProd = env.NODE_ENV === 'production'

export const config = {
  port: Number(env.PORT || 4000),
  databaseUrl: env.DATABASE_URL,
  databaseSsl: bool(env.DATABASE_SSL),
  origins: (env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean),
  jwtSecret: env.JWT_SECRET,
  formTokenSecret: env.FORM_TOKEN_SECRET,
  uploadDir: path.resolve(env.UPLOAD_DIR || './storage/cvs'),
  maxCvBytes: Math.round(Number(env.MAX_CV_MB || 5) * 1024 * 1024),
  serveFrontend: bool(env.SERVE_FRONTEND),
  trustProxy: bool(env.TRUST_PROXY),
  smtp: { host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: bool(env.SMTP_SECURE), user: env.SMTP_USER, pass: env.SMTP_PASS },
  mailFrom: env.MAIL_FROM || 'Goalings <no-reply@goalings.com>',
  adminNotifyEmail: env.ADMIN_NOTIFY_EMAIL,
}

export function assertConfig() {
  const problems = []
  if (!config.databaseUrl) problems.push('DATABASE_URL is required')
  if (!config.jwtSecret || config.jwtSecret.length < 32) problems.push('JWT_SECRET must be set (32+ characters)')
  if (!config.formTokenSecret || config.formTokenSecret.length < 32) problems.push('FORM_TOKEN_SECRET must be set (32+ characters)')
  if (problems.length) { console.error('Configuration error:\n - ' + problems.join('\n - ')); process.exit(1) }
}
