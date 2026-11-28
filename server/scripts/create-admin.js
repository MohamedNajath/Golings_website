// Creates (or resets the password of) an administrator. Credentials are never stored in code.
//   npm run create-admin -- --email you@goalings.com [--role admin|viewer]
// The password is typed at a hidden prompt (or supplied via ADMIN_PASSWORD for automation).
import readline from 'node:readline'
import bcrypt from 'bcryptjs'
import { assertConfig } from '../src/config.js'
assertConfig()
const { pool } = await import('../src/db.js')
const { migrate } = await import('../src/migrate.js')

const arg = n => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : undefined }
const email = (arg('email') || '').trim().toLowerCase(), role = arg('role') || 'admin'
if (!/^\S+@\S+\.\S+$/.test(email) || !['admin', 'viewer'].includes(role)) { console.error('Usage: npm run create-admin -- --email you@example.com [--role admin|viewer]'); process.exit(1) }

function askHidden(prompt) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = s => { if (s.includes(prompt)) rl.output.write(s); else rl.output.write('') }
    rl.question(prompt, a => { rl.close(); process.stdout.write('\n'); resolve(a) })
  })
}
const password = process.env.ADMIN_PASSWORD || await askHidden('Password (min 12 chars): ')
if (password.length < 12) { console.error('Password must be at least 12 characters.'); process.exit(1) }
await migrate()
const hash = await bcrypt.hash(password, 12)
await pool.query(`INSERT INTO admin_users(email,password_hash,role) VALUES ($1,$2,$3) ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash, role=EXCLUDED.role`, [email, hash, role])
console.log(`Admin ${email} saved with role "${role}".`)
await pool.end()
