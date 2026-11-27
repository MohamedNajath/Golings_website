import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, User } from 'lucide-react'
import { Member } from '../data/careers'

const initials = (n: string) => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export default function TeamSlider({ members }: { members: Member[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [playing, setPlaying] = useState(true)
  const [hover, setHover] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current; if (!el) return
    const card = el.querySelector('li') as HTMLElement | null
    const w = (card?.offsetWidth ?? 300) + 20
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    else el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!playing || hover || reduced) return
    const id = setInterval(() => step(1), 3500)
    return () => clearInterval(id)
  }, [playing, hover, reduced, step])

  const btn = 'grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:border-orange hover:text-orange'

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Meet the team"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <ul ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth py-2 sm:gap-5">
        {members.map((m, i) => (
          <li key={m.name} aria-label={`${i + 1} of ${members.length}`}
            className="w-[82%] shrink-0 snap-start rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur sm:p-6 transition hover:-translate-y-1 hover:border-orange sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]">
            {m.photo
              ? <img src={m.photo} alt={m.name} loading="lazy" className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-orange/60" />
              : <div aria-hidden className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-orange to-amber-400 text-3xl font-extrabold text-navy ring-4 ring-white/10">{/^Team Member/.test(m.name) ? <User size={44} /> : initials(m.name)}</div>}
            <h3 className="mt-4 font-bold">{m.name}</h3>
            <p className="text-sm font-semibold text-orange">{m.role}</p>
            <p className="mt-2 text-sm text-slate-300">{m.bio}</p>
          </li>))}
      </ul>
      <div className="mt-6 flex items-center gap-3">
        <button className={btn} onClick={() => step(-1)} aria-label="Previous team members"><ChevronLeft size={20} /></button>
        <button className={btn} onClick={() => step(1)} aria-label="Next team members"><ChevronRight size={20} /></button>
        <button className={btn} onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause auto-scroll' : 'Start auto-scroll'}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
      </div>
    </div>
  )
}
