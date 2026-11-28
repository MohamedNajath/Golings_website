import { useEffect } from 'react'
import { SITE_URL } from '../data/internshipConfig'

interface Seo { title: string; description: string; path: string; image?: string; noindex?: boolean; jsonLd?: object[] }
function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}
// Minimal head manager (no extra dependency): title, description, canonical, Open Graph, Twitter card, JSON-LD.
export function useSeo({ title, description, path, image = '/og-internship.png', noindex, jsonLd }: Seo) {
  useEffect(() => {
    const prevTitle = document.title; document.title = title
    const url = SITE_URL + path, img = image.startsWith('http') ? image : SITE_URL + image
    setMeta('name', 'description', description); setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', title); setMeta('property', 'og:description', description); setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', url); setMeta('property', 'og:image', img); setMeta('property', 'og:site_name', 'Goalings')
    setMeta('name', 'twitter:card', 'summary_large_image'); setMeta('name', 'twitter:title', title); setMeta('name', 'twitter:description', description); setMeta('name', 'twitter:image', img)
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = url
    const scripts = (jsonLd ?? []).map(obj => { const s = document.createElement('script'); s.type = 'application/ld+json'; s.dataset.seo = '1'; s.text = JSON.stringify(obj); document.head.appendChild(s); return s })
    return () => { document.title = prevTitle; scripts.forEach(s => s.remove()); setMeta('name', 'robots', 'index, follow') }
  }, [title, description, path, image, noindex, JSON.stringify(jsonLd)]) // eslint-disable-line react-hooks/exhaustive-deps
}
