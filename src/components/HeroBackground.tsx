import { useEffect, useRef } from 'react'

// Premium animated hero backdrop.
//  - CSS: deep navy → electric-blue gradient, glowing orange/blue orbs, soft light beams (transform-only animations)
//  - Canvas: small glowing red particles that drift and twinkle (pre-rendered sprite, DPR-capped,
//    paused when off-screen / tab hidden, static for prefers-reduced-motion)
//  - Gentle pointer parallax on desktop
type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number; ph: number; z: number }

export default function HeroBackground() {
  const root = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = root.current, c = cv.current
    const ctx = c?.getContext('2d')
    if (!el || !c || !ctx) return
    const host = el.parentElement ?? el
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    // Pre-render one soft red glow sprite; every particle is a scaled drawImage of it.
    const S = 64
    const sprite = document.createElement('canvas'); sprite.width = sprite.height = S
    const sc = sprite.getContext('2d')!
    const g = sc.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
    g.addColorStop(0, 'rgba(255,92,100,1)'); g.addColorStop(0.16, 'rgba(255,48,64,.95)')
    g.addColorStop(0.42, 'rgba(255,30,50,.22)'); g.addColorStop(1, 'rgba(255,30,50,0)')
    sc.fillStyle = g; sc.fillRect(0, 0, S, S)

    let w = 0, h = 0, parts: P[] = [], raf = 0, last = 0, onScreen = true
    let tx = 0, ty = 0, px = 0, py = 0

    const build = () => {
      const r = host.getBoundingClientRect(); w = r.width; h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, w < 640 ? 1.5 : 2)
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(90, Math.max(26, (w * h) / 15000)))
      parts = Array.from({ length: n }, () => {
        const big = Math.random() < 0.14
        const r = big ? 1.7 + Math.random() * 0.9 : 0.7 + Math.random() * 0.9
        const ang = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 9
        return { x: Math.random() * w, y: Math.random() * h, r, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 2,
          a: 0.28 + Math.random() * 0.42, tw: Math.random() < 0.55 ? 0.35 + Math.random() * 0.9 : 0, ph: Math.random() * 6.28, z: 0.3 + Math.random() * 0.7 }
      })
    }

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h)
      px += (tx - px) * 0.04; py += (ty - py) * 0.04
      if (fine && !reduce) { el.style.setProperty('--px', px.toFixed(3)); el.style.setProperty('--py', py.toFixed(3)) }
      const m = 24
      for (const p of parts) {
        p.x += p.vx * dt; p.y += p.vy * dt
        if (p.x < -m) p.x = w + m; else if (p.x > w + m) p.x = -m
        if (p.y < -m) p.y = h + m; else if (p.y > h + m) p.y = -m
        const tw = p.tw ? 0.55 + 0.45 * Math.sin(p.ph + t * 0.001 * p.tw) : 1
        const d = p.r * 11
        ctx.globalAlpha = p.a * tw
        ctx.drawImage(sprite, p.x + px * p.z * 16 - d / 2, p.y + py * p.z * 12 - d / 2, d, d)
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000 || 0.016, 0.05); last = t
      draw(t, dt); raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf && !reduce && onScreen && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop) } }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    build(); draw(0, 0)   // reduced motion: this single static frame is all that is drawn
    start()

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop() })
    io.observe(host)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    let rt = 0
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = window.setTimeout(() => { build(); if (reduce) draw(0, 0) }, 150) })
    ro.observe(host)
    const move = (e: PointerEvent) => { const r = host.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2 }
    const leave = () => { tx = 0; ty = 0 }
    if (fine && !reduce) { host.addEventListener('pointermove', move, { passive: true }); host.addEventListener('pointerleave', leave) }

    return () => { stop(); io.disconnect(); ro.disconnect(); clearTimeout(rt); document.removeEventListener('visibilitychange', onVis); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave) }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="hero-bg">
      <div className="hero-grid" />
      <div className="hero-par" style={{ ['--d' as string]: 10 }}><div className="hero-orb hero-orb-blue-1" /></div>
      <div className="hero-par" style={{ ['--d' as string]: 14 }}><div className="hero-orb hero-orb-blue-2" /></div>
      <div className="hero-par" style={{ ['--d' as string]: 22 }}><div className="hero-orb hero-orb-orange-1" /></div>
      <div className="hero-par" style={{ ['--d' as string]: 30 }}><div className="hero-orb hero-orb-orange-2" /></div>
      <div className="hero-par" style={{ ['--d' as string]: 16 }}><div className="hero-orb hero-orb-orange-3" /></div>
      <div className="hero-beam hero-beam-1" />
      <div className="hero-beam hero-beam-2" />
      <div className="hero-scrim" />
      <canvas ref={cv} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
