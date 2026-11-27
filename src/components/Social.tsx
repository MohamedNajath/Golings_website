import { Facebook, Github, Instagram, Linkedin, LucideIcon, MessageCircle, Youtube } from 'lucide-react'
import { company, socials } from '../data/company'

// Full class strings so Tailwind keeps them.
const brand: Record<string, { Icon: LucideIcon; hover: string }> = {
  LinkedIn: { Icon: Linkedin, hover: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[#0A66C2]/40' },
  Facebook: { Icon: Facebook, hover: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[#1877F2]/40' },
  Instagram: { Icon: Instagram, hover: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-[#DD2A7B] hover:shadow-[#DD2A7B]/40' },
  YouTube: { Icon: Youtube, hover: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-[#FF0000]/40' },
  GitHub: { Icon: Github, hover: 'hover:bg-slate-700 hover:border-slate-500 hover:shadow-white/20' },
  WhatsApp: { Icon: MessageCircle, hover: 'hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[#25D366]/40' },
}

export default function SocialLinks({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const items = [
    ...socials.filter(s => s.url),
    ...(company.whatsapp ? [{ name: 'WhatsApp', url: `https://wa.me/${company.whatsapp.replace(/\D/g, '')}` }] : []),
  ]
  const base = tone === 'dark'
    ? 'border-white/15 bg-white/5 text-slate-200'
    : 'border-slate-200 bg-white text-navy'
  return (
    <ul className="flex flex-wrap gap-3">
      {items.map(({ name, url }) => {
        const b = brand[name]; if (!b) return null
        return (
          <li key={name}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Goalings on ${name}`} title={name}
              className={`group grid h-11 w-11 place-items-center rounded-full border shadow-lg shadow-transparent transition duration-300 hover:-translate-y-1 hover:text-white ${base} ${b.hover}`}>
              <b.Icon size={20} className="transition duration-300 group-hover:scale-110" />
            </a>
          </li>)
      })}
    </ul>)
}
