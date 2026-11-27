import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowUp, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import SocialLinks from './Social'
import { company, telHref } from '../data/company'
import { services } from '../data/services'

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/careers', 'Careers'], ['/contact', 'Contact']]

export const Logo = () => <span className="text-lg font-extrabold tracking-[0.14em] text-white">GOAL<span className="text-orange">I</span>NGS</span>

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])
  useEffect(() => { const f = () => { if (window.innerWidth >= 768) setOpen(false) }; window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  return (
    <>
      <header className={`sticky top-0 z-30 text-white backdrop-blur ${open ? 'bg-navy' : 'bg-navy/90'}`}>
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Goalings home" className="shrink-0"><Logo /></Link>
          <nav aria-label="Main" className="hidden gap-5 text-sm text-slate-300 md:flex lg:gap-7">
            {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'text-orange' : 'hover:text-orange'}>{l}</NavLink>)}
          </nav>
          <Link to="/contact" className="btn-p hidden !py-2 md:inline-flex">Let’s talk</Link>
          <button className="-mr-2 grid h-11 w-11 place-items-center md:hidden" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav id="mobile-nav" aria-label="Mobile" className="wrap max-h-[calc(100svh-64px)] overflow-y-auto border-t border-white/10 pb-6 pt-2 md:hidden">
          {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex min-h-[48px] items-center border-b border-white/10 text-base ${isActive ? 'font-bold text-orange' : 'text-slate-200'}`}>{l}</NavLink>)}
          <Link to="/contact" className="btn-p mt-5 w-full">Let’s talk</Link>
        </nav>}
      </header>
      <main><Outlet /></main>
      <footer className="relative overflow-hidden bg-[#041021] text-sm text-slate-400">
        <div className="h-px bg-gradient-to-r from-transparent via-orange to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="wrap relative grid gap-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Goalings home"><Logo /></Link>
            <p className="mt-3 max-w-xs">Turning ideas into technology. Software development and IT solutions for tomorrow.</p>
            <h4 className="mb-3 mt-6 font-bold text-white">Connect with us</h4>
            <SocialLinks />
          </div>
          <div><h4 className="mb-3 font-bold text-white">Services</h4>{['custom-software-development', 'web-application-development', 'ui-ux-design', 'it-consulting'].map(slug => <Link key={slug} to={`/services/${slug}`} className="block py-1.5 transition hover:translate-x-1 hover:text-orange">{services.find(x => x.slug === slug)?.title ?? slug}</Link>)}</div>
          <div><h4 className="mb-3 font-bold text-white">Company</h4>{links.slice(1).map(([to, l]) => <Link key={to} to={to} className="block py-1.5 transition hover:translate-x-1 hover:text-orange">{l}</Link>)}</div>
          <div>
            <h4 className="mb-3 font-bold text-white">Get in touch</h4>
            <ul className="space-y-3">
              <li><a href={`mailto:${company.email}`} className="group flex items-start gap-3 hover:text-white"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-orange transition group-hover:bg-orange group-hover:text-navy"><Mail size={17} /></span><span className="break-all pt-1.5">{company.email}</span></a></li>
              <li><a href={telHref} className="group flex items-start gap-3 hover:text-white"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-orange transition group-hover:bg-orange group-hover:text-navy"><Phone size={17} /></span><span className="pt-1.5">{company.phone}</span></a></li>
              <li><Link to="/contact#map" className="group flex items-start gap-3 hover:text-white"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-orange transition group-hover:bg-orange group-hover:text-navy"><MapPin size={17} /></span><span className="pt-1">{company.address.map(l => <span key={l} className="block">{l}</span>)}</span></Link></li>
            </ul>
          </div>
        </div>
        <div className="wrap relative flex flex-col items-start justify-between gap-4 border-t border-white/10 py-5 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} GOALINGS. All rights reserved.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-4 text-slate-300 transition hover:border-orange hover:text-orange">Back to top <ArrowUp size={16} className="transition group-hover:-translate-y-0.5" /></button>
        </div>
      </footer>
    </>
  )
}
