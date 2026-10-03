import { cn } from '../../lib/cn'
import Container from './Container'

// The blue banner that opens every page. `overlap` leaves extra room at the
// bottom so the first white panel below can ride up over the band, a pattern
// that ties the header to the content.
export default function PageHero({ eyebrow, title, lead, children, overlap = false, className }) {
  return (
    <section className={cn('relative overflow-hidden bg-brand-500 text-white', className)}>
      {/* Decorative rounded blocks, purely visual. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <div className="absolute -right-10 top-8 h-44 w-44 rounded-3xl bg-white/10" />
        <div className="absolute right-40 top-24 h-24 w-24 rounded-2xl border-2 border-white/25" />
        <div className="absolute right-16 bottom-6 h-16 w-16 rounded-xl bg-white/15" />
      </div>

      <Container className={cn('relative pt-12 sm:pt-14', overlap ? 'pb-24 sm:pb-28' : 'pb-12 sm:pb-14')}>
        <div className="max-w-3xl animate-fade-in">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{eyebrow}</p>
          )}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
          {lead && <p className="mt-4 text-base leading-relaxed text-white/85">{lead}</p>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
