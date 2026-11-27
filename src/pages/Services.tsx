import { services } from '../data/services'
import { CTA, PageHero, Reveal, ServiceCard } from '../components/ui'

export default function Services() {
  return (
    <>
      <PageHero title="Our services" text="Everything you need to plan, design, build and maintain your software." />
      <section className="section"><div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(s => <Reveal key={s.slug}><ServiceCard s={s} /></Reveal>)}</div></section>
      <CTA />
    </>
  )
}
