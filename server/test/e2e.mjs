// End-to-end API test against a REAL PostgreSQL database and a local SMTP catcher.
//   DATABASE_URL=postgres://... npm test
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gl-e2e-'))
const mails = []
// minimal SMTP server that records messages (so email sending is really exercised)
const smtp = net.createServer(sock => {
  let data = '', inData = false, msg = ''
  sock.write('220 test ESMTP\r\n')
  sock.on('data', chunk => {
    data += chunk.toString()
    let i; while ((i = data.indexOf('\r\n')) > -1) {
      const line = data.slice(0, i); data = data.slice(i + 2)
      if (inData) { if (line === '.') { inData = false; mails.push(msg); msg = ''; sock.write('250 OK\r\n') } else msg += line + '\n'; continue }
      const c = line.toUpperCase()
      if (c.startsWith('EHLO') || c.startsWith('HELO')) sock.write('250 test\r\n')
      else if (c.startsWith('DATA')) { inData = true; sock.write('354 go\r\n') }
      else if (c.startsWith('QUIT')) { sock.write('221 bye\r\n'); sock.end() }
      else sock.write('250 OK\r\n')
    }
  })
}).listen(0)
await new Promise(r => smtp.once('listening', r))

Object.assign(process.env, {
  NODE_ENV: 'test', DATABASE_URL: process.env.DATABASE_URL || 'postgres://goalings:goalings_dev_pw@localhost:5432/goalings',
  JWT_SECRET: crypto.randomBytes(32).toString('hex'), FORM_TOKEN_SECRET: crypto.randomBytes(32).toString('hex'), UPLOAD_DIR: path.join(tmp, 'cvs'),
  SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtp.address().port), ADMIN_NOTIFY_EMAIL: 'hr@goalings.test', MAX_CV_MB: '1',
})
const { createApp } = await import('../src/app.js'); const { migrate } = await import('../src/migrate.js'); const { pool } = await import('../src/db.js')
const bcrypt = (await import('bcryptjs')).default
await migrate()
await pool.query("DELETE FROM admin_users WHERE email LIKE '%@e2e.test'")
await pool.query("DELETE FROM internship_applications WHERE email LIKE '%@e2e.test'")
const hash = await bcrypt.hash('CorrectHorseBattery1', 10)
await pool.query("INSERT INTO admin_users(email,password_hash,role) VALUES ('boss@e2e.test',$1,'admin'),('view@e2e.test',$1,'viewer')", [hash])

const server = createApp().listen(0); await new Promise(r => server.once('listening', r))
const base = `http://127.0.0.1:${server.address().port}`
let pass = 0; const ok = (name) => { pass++; console.log('  ✓', name) }
const pdf = (n = 3000) => Buffer.concat([Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\n'), Buffer.alloc(n, 0x20), Buffer.from('\n%%EOF')])
const nextWeek = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)
const good = (over = {}) => ({ full_name: 'Ayesha Perera', email: 'ayesha@e2e.test', phone: '+974 5512 3456', whatsapp: '+974 5512 3456', country: 'Qatar', city: 'Doha',
  qualification: 'degree', institution: 'Example University', field_of_study: 'Computer Science', academic_status: 'final_year_student', program: 'software-engineering', training_mode: 'hybrid',
  preferred_start_date: nextWeek, previous_experience: 'Personal projects', technical_skills: 'Java, SQL', programming_knowledge: 'OOP, REST', additional_info: '', linkedin_url: 'https://www.linkedin.com/in/example',
  github_url: 'https://github.com/example', portfolio_url: 'https://example.com', motivation: 'I want to learn how professional teams build and ship real software products.', consent_privacy: 'true', consent_terms: 'true', company_website: '', ...over })
const oldToken = () => { const t = String(Date.now() - 20_000); return `${t}.${crypto.createHmac('sha256', process.env.FORM_TOKEN_SECRET).update(t).digest('hex')}` }
async function submit(fields = {}, { file = pdf(), name = 'cv.pdf', type = 'application/pdf', token, noFile } = {}) {
  const fd = new FormData(); const f = good(fields)
  for (const [k, v] of Object.entries(f)) if (v !== undefined) fd.append(k, v)
  fd.append('form_token', token ?? oldToken()); if (!noFile) fd.append('cv', new Blob([file], { type }), name)
  const r = await fetch(base + '/api/internship/applications', { method: 'POST', body: fd }); return { status: r.status, body: await r.json().catch(() => ({})) }
}
async function login(email, password = 'CorrectHorseBattery1') {
  const r = await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
  const cookie = (r.headers.get('set-cookie') || '').split(';')[0]; return { status: r.status, cookie, body: await r.json() }
}
const api = (cookie, p, init = {}) => fetch(base + '/api/admin' + p, { ...init, headers: { cookie, 'Content-Type': 'application/json', 'X-Requested-With': 'goalings-admin', ...(init.headers || {}) } })

console.log('Public submission')
let r = await (await fetch(base + '/api/internship/form-token')).json(); assert.match(r.token, /^\d+\.[0-9a-f]{64}$/); ok('form token issued')
let s = await submit({}, { token: r.token }); assert.equal(s.status, 400); assert.ok(s.body.refreshToken); ok('instant submission (bot-like) rejected')
s = await submit({}, { token: 'garbage' }); assert.equal(s.status, 400); ok('forged token rejected')
s = await submit({ company_website: 'http://spam.example' }); assert.equal(s.status, 400); ok('honeypot rejected')
s = await submit({ full_name: '', email: 'nope', phone: 'abc', program: 'cooking', consent_privacy: 'false', motivation: 'short' }, { noFile: true })
assert.equal(s.status, 400); for (const k of ['full_name', 'email', 'phone', 'program', 'consent_privacy', 'motivation', 'cv']) assert.ok(s.body.fields[k], 'missing error for ' + k); ok('required/format validation (name, email, phone, program, consent, motivation, cv)')
s = await submit({ preferred_start_date: '2001-01-01' }); assert.ok(s.body.fields?.preferred_start_date); ok('past start date rejected')
s = await submit({ linkedin_url: 'https://evil.example/in/x', github_url: 'javascript:alert(1)' }); assert.ok(s.body.fields?.linkedin_url && s.body.fields?.github_url); ok('LinkedIn/GitHub URL validation (no javascript: URLs)')
s = await submit({}, { file: Buffer.from('MZ not a pdf'.repeat(200)) }); assert.equal(s.body.fields?.cv, 'The CV must be a valid PDF file'); ok('non-PDF content with .pdf name rejected (magic bytes)')
s = await submit({}, { name: 'cv.exe' }); assert.ok(s.body.fields?.cv); ok('wrong extension rejected')
s = await submit({}, { file: pdf(1.2 * 1024 * 1024) }); assert.equal(s.status, 400); assert.match(s.body.fields.cv, /smaller/); ok('oversize CV rejected')
const before = (await pool.query("SELECT count(*)::int n FROM internship_applications WHERE email LIKE '%@e2e.test'")).rows[0].n; assert.equal(before, 0); ok('no rows stored for any rejected submission')

s = await submit(); assert.equal(s.status, 201); assert.match(s.body.reference, /^GL-INT-\d{6}$/); const ref = s.body.reference; ok(`valid application stored → ${ref}`)
const row = (await pool.query('SELECT * FROM internship_applications WHERE reference=$1', [ref])).rows[0]
assert.equal(row.status, 'pending'); assert.equal(row.program, 'software-engineering'); assert.ok(row.created_at); assert.equal(row.ack_email_status, 'sent'); assert.equal(row.admin_email_status, 'sent')
const stored = path.join(process.env.UPLOAD_DIR, row.cv_path); assert.ok(fs.existsSync(stored)); assert.ok(!row.cv_path.includes('cv.pdf')); assert.equal((fs.statSync(stored).mode & 0o777), 0o600); ok('row + timestamp saved; CV saved under random name, mode 600, outside web root')
assert.equal(mails.length, 2); assert.ok(mails.some(m => /To: ayesha@e2e.test/i.test(m) && m.includes(ref))); assert.ok(mails.some(m => /To: hr@goalings.test/i.test(m))); ok('applicant acknowledgement + admin notification emails delivered via SMTP')
await submit({ email: 'second@e2e.test', full_name: 'Nimal Silva', program: 'ui-ux-design', training_mode: 'online', academic_status: 'recently_graduated', qualification: 'diploma' }); ok('second application (different program/mode/status)')

console.log('Admin API')
let a = await fetch(base + '/api/admin/applications'); assert.equal(a.status, 401); ok('list without login → 401')
a = await fetch(base + `/api/admin/applications/1/cv`); assert.equal(a.status, 401); ok('CV without login → 401')
assert.equal((await login('boss@e2e.test', 'wrong-password')).status, 401); assert.equal((await login('ghost@e2e.test')).status, 401); ok('wrong password / unknown user → 401')
const L = await login('boss@e2e.test'); assert.equal(L.status, 200); assert.ok(L.cookie.startsWith('gl_admin=')); ok('admin login')
const setCookie = (await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'boss@e2e.test', password: 'CorrectHorseBattery1' }) })).headers.get('set-cookie')
assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=Strict/i); ok('session cookie is HttpOnly + SameSite=Strict')
const ck = L.cookie
let list = await (await api(ck, '/applications')).json(); assert.ok(list.total >= 2); assert.ok(!('cv_path' in list.items[0])); ok('list applications (no internal file paths exposed)')
list = await (await api(ck, '/applications?q=ayesha')).json(); assert.equal(list.items.length, 1); ok('search by name')
list = await (await api(ck, '/applications?q=GL-INT')).json(); assert.ok(list.total >= 2); ok('search by reference')
list = await (await api(ck, "/applications?q=%25")).json(); assert.equal(list.total, 0); ok('LIKE wildcards are escaped')
list = await (await api(ck, '/applications?program=ui-ux-design')).json(); assert.ok(list.items.every(i => i.program === 'ui-ux-design') && list.items.length >= 1); ok('filter by program')
list = await (await api(ck, '/applications?training_mode=online')).json(); assert.ok(list.items.every(i => i.training_mode === 'online')); ok('filter by training mode')
list = await (await api(ck, '/applications?academic_status=final_year_student')).json(); assert.ok(list.items.every(i => i.academic_status === 'final_year_student')); ok('filter by academic status')
assert.equal((await api(ck, "/applications?program=x';DROP TABLE internship_applications;--")).status, 400); ok('malicious filter value rejected')
const id = (await (await api(ck, '/applications?q=ayesha')).json()).items[0].id
const det = await (await api(ck, `/applications/${id}`)).json(); assert.equal(det.motivation.slice(0, 6), 'I want'); assert.ok(!('cv_path' in det) && !('ip_hash' in det)); ok('full applicant details')
const cvRes = await api(ck, `/applications/${id}/cv`); assert.equal(cvRes.status, 200); assert.equal(cvRes.headers.get('content-type'), 'application/pdf'); assert.match(cvRes.headers.get('content-disposition'), /attachment/)
assert.equal((await cvRes.arrayBuffer()).byteLength, fs.statSync(stored).size); ok('CV download (authenticated) returns the stored file')
let p = await api(ck, `/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'interview_scheduled', interview_at: '2030-01-15T09:30:00+04:00', evaluation_feedback: 'Strong Java basics.' }) })
let pj = await p.json(); assert.equal(p.status, 200); assert.equal(pj.status, 'interview_scheduled'); assert.equal(pj.status_updated_by, 'boss@e2e.test'); assert.ok(pj.interview_at); ok('update status + interview date + evaluation feedback')
assert.equal((await api(ck, `/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'hired!' }) })).status, 400); ok('invalid status rejected')
let n = await api(ck, `/applications/${id}/notes`, { method: 'POST', body: JSON.stringify({ note: 'Called candidate, available weekdays.' }) }); assert.equal(n.status, 201)
assert.equal((await api(ck, `/applications/${id}/notes`, { method: 'POST', body: JSON.stringify({ note: '   ' }) })).status, 400); ok('add internal note (empty note rejected)')
const det2 = await (await api(ck, `/applications/${id}`)).json(); assert.equal(det2.notes.length, 1); assert.equal(det2.notes[0].author_email, 'boss@e2e.test'); assert.equal(det2.status, 'interview_scheduled'); ok('notes + status persisted')
assert.equal((await fetch(base + `/api/admin/applications/${id}`, { method: 'PATCH', headers: { cookie: ck, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) })).status, 403); ok('state-changing request without X-Requested-With → 403 (CSRF guard)')
await api(ck, `/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'accepted' }) })
const st = await (await api(ck, '/stats')).json(); assert.ok(st.total >= 2 && st.accepted >= 1 && st.pending >= 1); assert.ok(st.byProgram.find(x => x.k === 'software-engineering')); assert.ok(st.byMode.length >= 2); ok('dashboard statistics (totals, by program, by mode)')
const V = await login('view@e2e.test'); assert.equal((await api(V.cookie, `/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) })).status, 403)
assert.equal((await api(V.cookie, `/applications/${id}/notes`, { method: 'POST', body: JSON.stringify({ note: 'x' }) })).status, 403); assert.equal((await api(V.cookie, '/applications')).status, 200); ok('viewer role: can read, cannot modify (RBAC)')
assert.equal((await api('gl_admin=forged.jwt.token', '/applications')).status, 401); ok('forged session rejected')
await pool.query("DELETE FROM admin_users WHERE email='view@e2e.test'"); assert.equal((await api(V.cookie, '/applications')).status, 401); ok('deleting an admin revokes their session immediately')

console.log('Abuse limits')
let last; for (let i = 0; i < 4; i++) last = await submit({ email: `rl${i}@e2e.test` }); assert.ok([201, 429].includes(last.status)); const rl = await submit({ email: 'rl-final@e2e.test' }); assert.equal(rl.status, 429); ok('submission rate limit (5/hour/IP) → 429')
let bad = 0; for (let i = 0; i < 12; i++) bad = (await login('boss@e2e.test', 'nope-nope-nope')).status; assert.equal(bad, 429); ok('login brute-force limit → 429')

await pool.query("DELETE FROM internship_applications WHERE email LIKE '%@e2e.test'"); await pool.query("DELETE FROM admin_users WHERE email LIKE '%@e2e.test'")
server.close(); smtp.close(); await pool.end(); fs.rmSync(tmp, { recursive: true, force: true })
console.log(`\nAll ${pass} checks passed.`); process.exit(0)
