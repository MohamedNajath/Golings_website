// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE: your real contact details live here.
//  They feed the footer, the Contact page and the map.
//  Anything marked PLACEHOLDER must be replaced before launch.
// ─────────────────────────────────────────────────────────────
export const company = {
  email: 'goalingsinc@gmail.com',                       // PLACEHOLDER: confirm
  phone: '+94 77 199 6958',                        // PLACEHOLDER
  whatsapp: '+94 77 199 6958',                                     // digits only with country code, e.g. '97455123456'. Leave '' to hide the WhatsApp icon
  hours: 'Sun – Thu, 9:00 AM – 5:00 PM',            // PLACEHOLDER
  address: ['476A, Main Street,Sainthamarathu-16', 'Kalmunai, Sri Lanka'], // PLACEHOLDER: one string per line
  // Map: type your address exactly as Google Maps would find it, e.g. 'Goalings, West Bay, Doha'.
  // Leave '' to show a placeholder panel instead of a map.
  mapQuery: '476A, Main Street,Sainthamarathu-16, Kalmunai, Sri Lanka',
  // Optional: paste the "src" of Google Maps ▸ Share ▸ Embed a map for a pin on your exact spot.
  mapEmbedUrl: '',
}

// Social profiles. Replace each URL with your page; set '' to hide an icon.
export const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/' },     // PLACEHOLDER
  { name: 'Facebook', url: 'https://www.facebook.com/' },     // PLACEHOLDER
  { name: 'Instagram', url: 'https://www.instagram.com/' },   // PLACEHOLDER
  { name: 'YouTube', url: 'https://www.youtube.com/' },       // PLACEHOLDER
  { name: 'GitHub', url: 'https://github.com/' },             // PLACEHOLDER
]

export const telHref = `tel:${company.phone.replace(/[^+\d]/g, '')}`
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery || company.address.join(', '))}`
export const mapsEmbedSrc = company.mapEmbedUrl || (company.mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&output=embed` : '')
