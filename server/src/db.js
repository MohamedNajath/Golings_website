import pg from 'pg'
import { config } from './config.js'
export const pool = new pg.Pool({ connectionString: config.databaseUrl, ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined, max: 10 })
export const q = (text, params) => pool.query(text, params)
