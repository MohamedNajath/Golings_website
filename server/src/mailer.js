import nodemailer from 'nodemailer'
import { config } from './config.js'

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
let transport
export const mailConfigured = () => Boolean(config.smtp.host)
function getTransport() {
  transport ??= nodemailer.createTransport({ host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure, auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined })
  return transport
}
// Returns 'sent' | 'skipped' (SMTP not configured) | 'failed'. Never throws: a mail problem must not lose an application.
async function send(opts) {
  if (!mailConfigured()) return 'skipped'
  try { await getTransport().sendMail({ from: config.mailFrom, ...opts }); return 'sent' }
  catch (e) { console.error('[mail] send failed:', e.message); return 'failed' }
}

export const sendApplicantAck = a => send({
  to: a.email, subject: `We received your Goalings internship application (${a.reference})`,
  text: `Hello ${a.full_name},\n\nThank you for applying to the Goalings Internship Program.\nYour application reference is ${a.reference}.\n\nProgram: ${a.programLabel}\nTraining mode: ${a.training_mode}\n\nOur team will review your application and contact you regarding the next steps.\n\nGoalings`,
  html: `<p>Hello ${esc(a.full_name)},</p><p>Thank you for applying to the <strong>Goalings Internship Program</strong>.</p><p>Your application reference is <strong>${esc(a.reference)}</strong>.</p><p>Program: ${esc(a.programLabel)}<br>Training mode: ${esc(a.training_mode)}</p><p>Our team will review your application and contact you regarding the next steps.</p><p>Goalings</p>`,
})
export const sendAdminNotice = a => config.adminNotifyEmail ? send({
  to: config.adminNotifyEmail, replyTo: a.email, subject: `New internship application: ${a.full_name} (${a.reference})`,
  text: `New application ${a.reference}\nName: ${a.full_name}\nEmail: ${a.email}\nPhone: ${a.phone}\nProgram: ${a.programLabel}\nMode: ${a.training_mode}\nReview it in the admin dashboard: /admin/internships`,
  html: `<p>New internship application <strong>${esc(a.reference)}</strong></p><ul><li>Name: ${esc(a.full_name)}</li><li>Email: ${esc(a.email)}</li><li>Phone: ${esc(a.phone)}</li><li>Program: ${esc(a.programLabel)}</li><li>Mode: ${esc(a.training_mode)}</li></ul><p>Review it in the admin dashboard at /admin/internships.</p>`,
}) : 'skipped'
