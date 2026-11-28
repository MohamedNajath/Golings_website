// Applies every migrations/*.sql file once, in filename order. Safe to run repeatedly.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

export async function migrate() {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations')
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())')
  const done = new Set((await pool.query('SELECT name FROM schema_migrations')).rows.map(r => r.name))
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()) {
    if (done.has(f)) continue
    const client = await pool.connect()
    try {
      await client.query('BEGIN'); await client.query(fs.readFileSync(path.join(dir, f), 'utf8'))
      await client.query('INSERT INTO schema_migrations(name) VALUES ($1)', [f]); await client.query('COMMIT')
      console.log('applied', f)
    } catch (e) { await client.query('ROLLBACK'); throw e } finally { client.release() }
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { assertConfig } = await import('./config.js'); assertConfig()
  migrate().then(() => { console.log('migrations up to date'); return pool.end() }).catch(e => { console.error(e); process.exit(1) })
}
