import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Download, Loader2, LogOut, Search, X } from 'lucide-react'
import { api, apiUrl, ApiError } from '../../lib/api'
import { programs } from '../../data/internship'
import { useSeo } from '../../hooks/useSeo'

const STATUS: Record<string, string> = { pending: 'Pending', under_review: 'Under Review', shortlisted: 'Shortlisted', interview_scheduled: 'Interview Scheduled', accepted: 'Accepted', rejected: 'Rejected' }
const TONE: Record<string, string> = { pending: 'bg-slate-100 text-slate-700', under_review: 'bg-sky-100 text-sky-800', shortlisted: 'bg-violet-100 text-violet-800', interview_scheduled: 'bg-amber-100 text-amber-800', accepted: 'bg-emerald-100 text-emerald-800', rejected: 'bg-red-100 text-red-800' }
const ACADEMIC: Record<string, string> = { final_year_student: 'Final-Year Student', recently_graduated: 'Recently Graduated', degree_completed: 'Degree Completed', diploma_completed: 'Diploma Completed', other: 'Other' }
const QUAL: Record<string, string> = { degree: 'Degree', higher_diploma: 'Higher Diploma', diploma: 'Diploma', other: 'Other' }
const MODE: Record<string, string> = { online: 'Online', hybrid: 'Hybrid', 'on-site': 'On-site' }
const progName = (s: string) => programs.find(p => p.slug === s)?.formLabel ?? s
const fmt = (d?: string | null) => d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const toLocalInput = (d?: string | null) => { if (!d) return ''; const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 16) }
const Badge = ({ s }: { s: string }) => <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${TONE[s]}`}>{STATUS[s]}</span>

type Me = { email: string; role: 'admin' | 'viewer' }
export default function AdminInternships() {
  useSeo({ title: 'Internship applications | Goalings admin', description: 'Goalings admin', path: '/admin/internships', noindex: true })
  const [me, setMe] = useState<Me | null | undefined>(undefined)
  useEffect(() => { api<Me>('/api/admin/me', { admin: true }).then(setMe).catch(() => setMe(null)) }, [])
  if (me === undefined) return <div className="grid min-h-[50vh] place-items-center"><Loader2 className="animate-spin text-orange" /></div>
  if (!me) return <Login onDone={setMe} />
  return <Dashboard me={me} onLogout={async () => { await api('/api/admin/logout', { method: 'POST', admin: true }).catch(() => {}); setMe(null) }} />
}

function Login({ onDone }: { onDone: (m: Me) => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setErr('')
    try { onDone(await api<Me>('/api/admin/login', { method: 'POST', admin: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })) } catch (x) { setErr((x as ApiError).message) } finally { setBusy(false) } }
  return (
    <section className="section"><div className="wrap max-w-md"><form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
      <h1 className="text-2xl font-extrabold text-navy">Admin sign in</h1><p className="mb-5 mt-1 text-sm text-slate-600">Internship applications. Authorized staff only.</p>
      {err && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}
      <label htmlFor="a-email" className="mb-1 block text-sm font-bold text-navy">Email</label><input id="a-email" type="email" required autoComplete="username" className="field mb-4" value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="a-pass" className="mb-1 block text-sm font-bold text-navy">Password</label><input id="a-pass" type="password" required autoComplete="current-password" className="field mb-5" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn-p w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form></div></section>)
}

function Dashboard({ me, onLogout }: { me: Me; onLogout: () => void }) {
  const [stats, setStats] = useState<any>(null); const [list, setList] = useState<{ items: any[]; total: number; page: number; pageSize: number } | null>(null)
  const [f, setF] = useState({ q: '', program: '', status: '', academic_status: '', training_mode: '' }); const [page, setPage] = useState(1); const [sel, setSel] = useState<number | null>(null); const [err, setErr] = useState('')
  const [dq, setDq] = useState(''); useEffect(() => { const t = setTimeout(() => { setDq(f.q); setPage(1) }, 300); return () => clearTimeout(t) }, [f.q])
  const unauth = (e: unknown) => { if ((e as ApiError).status === 401) onLogout(); else setErr((e as ApiError).message) }
  const loadStats = useCallback(() => api('/api/admin/stats', { admin: true }).then(setStats).catch(unauth), []) // eslint-disable-line
  const load = useCallback(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: '15' }); if (dq) p.set('q', dq)
    ;(['program', 'status', 'academic_status', 'training_mode'] as const).forEach(k => f[k] && p.set(k, f[k]))
    api('/api/admin/applications?' + p, { admin: true }).then(r => { setList(r); setErr('') }).catch(unauth)
  }, [page, dq, f.program, f.status, f.academic_status, f.training_mode]) // eslint-disable-line
  useEffect(() => { loadStats() }, [loadStats]); useEffect(() => { load() }, [load])
  const setFilter = (k: string, v: string) => { setF(s => ({ ...s, [k]: v })); setPage(1) }
  const pages = list ? Math.max(1, Math.ceil(list.total / list.pageSize)) : 1
  const sel2 = 'field !py-2 text-sm'

  return (
    <section className="section"><div className="wrap">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Internship applications</h1><p className="text-sm text-slate-600">Signed in as {me.email} ({me.role === 'admin' ? 'administrator' : 'read-only'})</p></div>
        <button onClick={onLogout} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 px-4 font-bold text-navy hover:border-orange"><LogOut size={16} />Sign out</button></div>

      {stats && <>
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{[['Total applications', stats.total], ['Pending', stats.pending], ['Shortlisted', stats.shortlisted], ['Accepted', stats.accepted]].map(([l, n]) => <div key={l as string} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-3xl font-extrabold text-navy">{n}</div><div className="text-sm text-slate-600">{l}</div></div>)}</div>
        <div className="mb-6 grid gap-4 lg:grid-cols-2">{[['Applications by training program', stats.byProgram, progName], ['Applications by training mode', stats.byMode, (k: string) => MODE[k] ?? k]].map(([t, rows, label]: any) => (
          <div key={t} className="rounded-2xl border border-slate-200 bg-white p-4"><h2 className="mb-3 text-sm font-bold text-navy">{t}</h2>{rows.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
            <ul className="space-y-2">{rows.map((r: any) => <li key={r.k} className="text-sm"><div className="mb-0.5 flex justify-between gap-2"><span className="text-slate-700">{label(r.k)}</span><strong>{r.n}</strong></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-orange" style={{ width: `${(r.n / Math.max(1, stats.total)) * 100}%` }} /></div></li>)}</ul></div>))}</div>
        <p className="mb-6 text-sm text-slate-600">Under review: <strong>{stats.under_review}</strong> · Interviews scheduled: <strong>{stats.interview_scheduled}</strong> · Rejected: <strong>{stats.rejected}</strong></p></>}

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Search applications" placeholder="Search name, email, ref…" className={`${sel2} !pl-9`} value={f.q} onChange={e => setF(s => ({ ...s, q: e.target.value }))} /></div>
        <select aria-label="Filter by program" className={sel2} value={f.program} onChange={e => setFilter('program', e.target.value)}><option value="">All programs</option>{programs.map(p => <option key={p.slug} value={p.slug}>{p.formLabel}</option>)}</select>
        <select aria-label="Filter by status" className={sel2} value={f.status} onChange={e => setFilter('status', e.target.value)}><option value="">All statuses</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select aria-label="Filter by academic status" className={sel2} value={f.academic_status} onChange={e => setFilter('academic_status', e.target.value)}><option value="">All academic statuses</option>{Object.entries(ACADEMIC).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select aria-label="Filter by training mode" className={sel2} value={f.training_mode} onChange={e => setFilter('training_mode', e.target.value)}><option value="">All training modes</option>{Object.entries(MODE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      </div>
      {err && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Reference', 'Applicant', 'Program', 'Mode', 'Status', 'Submitted'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{list?.items.map(a => <tr key={a.id} tabIndex={0} onClick={() => setSel(a.id)} onKeyDown={e => e.key === 'Enter' && setSel(a.id)} className="cursor-pointer border-t border-slate-100 hover:bg-orange/5 focus:bg-orange/5">
          <td className="px-4 py-3 font-mono text-xs">{a.reference}</td><td className="px-4 py-3"><div className="font-bold text-navy">{a.full_name}</div><div className="text-xs text-slate-500">{a.email}</div></td><td className="px-4 py-3">{progName(a.program)}</td><td className="px-4 py-3">{MODE[a.training_mode]}</td><td className="px-4 py-3"><Badge s={a.status} /></td><td className="whitespace-nowrap px-4 py-3 text-slate-600">{fmt(a.created_at)}</td></tr>)}
          {list && list.items.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No applications match your filters.</td></tr>}</tbody></table></div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600"><span>{list ? `${list.total} application${list.total === 1 ? '' : 's'}` : 'Loading…'}</span>
        <div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="min-h-[40px] rounded-lg border border-slate-300 px-3 font-bold disabled:opacity-40">Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="min-h-[40px] rounded-lg border border-slate-300 px-3 font-bold disabled:opacity-40">Next</button></div></div>
    </div>
    {sel && <Detail id={sel} canEdit={me.role === 'admin'} onClose={() => setSel(null)} onChanged={() => { load(); loadStats() }} onUnauth={onLogout} />}
    </section>)
}

function Detail({ id, canEdit, onClose, onChanged, onUnauth }: { id: number; canEdit: boolean; onClose: () => void; onChanged: () => void; onUnauth: () => void }) {
  const [a, setA] = useState<any>(null); const [status, setStatus] = useState(''); const [iv, setIv] = useState(''); const [fb, setFb] = useState(''); const [note, setNote] = useState(''); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  const fail = (e: unknown) => { if ((e as ApiError).status === 401) onUnauth(); else setMsg((e as ApiError).message) }
  const load = useCallback(() => api(`/api/admin/applications/${id}`, { admin: true }).then(r => { setA(r); setStatus(r.status); setIv(toLocalInput(r.interview_at)); setFb(r.evaluation_feedback ?? '') }).catch(fail), [id]) // eslint-disable-line
  useEffect(() => { load() }, [load])
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [onClose])
  const json = { 'Content-Type': 'application/json' }
  const save = async () => { setBusy(true); setMsg(''); try { await api(`/api/admin/applications/${id}`, { method: 'PATCH', admin: true, headers: json, body: JSON.stringify({ status, interview_at: iv ? new Date(iv).toISOString() : null, evaluation_feedback: fb }) }); setMsg('Saved.'); await load(); onChanged() } catch (e) { fail(e) } finally { setBusy(false) } }
  const addNote = async () => { if (!note.trim()) return; setBusy(true); try { await api(`/api/admin/applications/${id}/notes`, { method: 'POST', admin: true, headers: json, body: JSON.stringify({ note }) }); setNote(''); await load() } catch (e) { fail(e) } finally { setBusy(false) } }
  const download = async () => { // authenticated download (cookie), saved with the server-provided filename
    try { const r = await fetch(apiUrl(`/api/admin/applications/${id}/cv`), { credentials: 'include' }); if (!r.ok) throw new ApiError(r.status, 'CV could not be downloaded.')
      const name = /filename="([^"]+)"/.exec(r.headers.get('content-disposition') || '')?.[1] ?? 'cv.pdf'; const url = URL.createObjectURL(await r.blob()); const l = document.createElement('a'); l.href = url; l.download = name; l.click(); URL.revokeObjectURL(url) } catch (e) { fail(e) } }
  const row = (k: string, v: any) => v ? <div className="grid gap-0.5 sm:grid-cols-[170px_1fr]"><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{k}</dt><dd className="break-words text-sm text-slate-800">{v}</dd></div> : null
  const link = (u?: string) => u ? <a href={u} target="_blank" rel="noopener noreferrer nofollow" className="text-navy underline hover:text-orange">{u}</a> : null
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Application details" onClick={e => e.stopPropagation()} className="h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-2xl sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-3"><div><p className="font-mono text-xs text-slate-500">{a?.reference}</p><h2 className="text-xl font-extrabold text-navy">{a?.full_name ?? 'Loading…'}</h2></div><button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 hover:border-orange"><X size={18} /></button></div>
        {a && <>
          <div className="mb-5 flex flex-wrap items-center gap-3"><Badge s={a.status} /><button onClick={download} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white hover:bg-navy-2"><Download size={16} />Download CV</button></div>
          <dl className="space-y-2.5">{row('Submitted', fmt(a.created_at))}{row('Email', <a className="text-navy underline" href={`mailto:${a.email}`}>{a.email}</a>)}{row('Phone', a.phone)}{row('WhatsApp', a.whatsapp)}{row('Location', `${a.city}, ${a.country}`)}
            {row('Qualification', QUAL[a.qualification])}{row('Institution', a.institution)}{row('Field of study', a.field_of_study)}{row('Academic status', ACADEMIC[a.academic_status])}
            {row('Program', progName(a.program))}{row('Training mode', MODE[a.training_mode])}{row('Preferred start', a.preferred_start_date && String(a.preferred_start_date).slice(0, 10))}
            {row('Technical skills', a.technical_skills)}{row('Programming knowledge', a.programming_knowledge)}{row('Previous experience', a.previous_experience)}{row('Additional info', a.additional_info)}
            {row('LinkedIn', link(a.linkedin_url))}{row('GitHub', link(a.github_url))}{row('Portfolio', link(a.portfolio_url))}{row('CV file', `${a.cv_original_name} (${(a.cv_size_bytes / 1048576).toFixed(2)} MB)`)}
            {row('Why Goalings?', <span className="whitespace-pre-wrap">{a.motivation}</span>)}{row('Consent', `Privacy + Terms accepted ${fmt(a.consent_at)}`)}{row('Emails', `Applicant: ${a.ack_email_status} · Admin: ${a.admin_email_status}`)}</dl>

          <h3 className="mb-3 mt-7 border-t border-slate-200 pt-5 font-bold text-navy">Review</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="d-status" className="mb-1 block text-sm font-bold text-navy">Status</label><select id="d-status" disabled={!canEdit} className="field" value={status} onChange={e => setStatus(e.target.value)}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label htmlFor="d-iv" className="mb-1 block text-sm font-bold text-navy">Interview date &amp; time</label><input id="d-iv" type="datetime-local" disabled={!canEdit} className="field" value={iv} onChange={e => setIv(e.target.value)} /></div>
            <div className="sm:col-span-2"><label htmlFor="d-fb" className="mb-1 block text-sm font-bold text-navy">Evaluation feedback</label><textarea id="d-fb" rows={3} disabled={!canEdit} className="field" value={fb} onChange={e => setFb(e.target.value)} /></div>
          </div>
          {a.status_updated_by && <p className="mt-2 text-xs text-slate-500">Status last changed by {a.status_updated_by} on {fmt(a.status_updated_at)}</p>}
          {canEdit && <button onClick={save} disabled={busy} className="btn-p mt-4">Save changes</button>}
          {msg && <p role="status" className="mt-2 text-sm text-slate-700">{msg}</p>}

          <h3 className="mb-3 mt-7 border-t border-slate-200 pt-5 font-bold text-navy">Internal notes</h3>
          {canEdit && <div className="mb-4"><label htmlFor="d-note" className="sr-only">New note</label><textarea id="d-note" rows={2} className="field" placeholder="Add an internal note (never shown to the applicant)" value={note} onChange={e => setNote(e.target.value)} /><button onClick={addNote} disabled={busy || !note.trim()} className="mt-2 min-h-[44px] rounded-lg bg-navy px-4 text-sm font-bold text-white disabled:opacity-50">Add note</button></div>}
          <ul className="space-y-3">{a.notes.map((n: any) => <li key={n.id} className="rounded-xl bg-slate-50 p-3 text-sm"><p className="whitespace-pre-wrap text-slate-800">{n.note}</p><p className="mt-1 text-xs text-slate-500">{n.author_email} · {fmt(n.created_at)}</p></li>)}{a.notes.length === 0 && <li className="text-sm text-slate-500">No notes yet.</li>}</ul>
        </>}
      </aside></div>)
}
