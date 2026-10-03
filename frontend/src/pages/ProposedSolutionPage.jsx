import { Database, FileCheck2, Filter, KeyRound, Layers3, MonitorSmartphone, ServerCog, ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card'
import Container from '../components/layout/Container'
import PageHero from '../components/layout/PageHero'

const PILLARS = [
  {
    icon: KeyRound,
    title: 'Role based access',
    body: 'A stateless JWT session identifies every request. Admins may publish and retire documents; employees may read. The rules are enforced on the server, with the client mirroring them for a smoother experience.',
  },
  {
    icon: Filter,
    title: 'One dynamic search',
    body: 'A single endpoint accepts optional filters for text, type, branch and date range using JPA Specifications, so any combination works without a separate query for each case.',
  },
  {
    icon: FileCheck2,
    title: 'Validated uploads',
    body: 'The backend reads the real file header with Apache Tika to confirm a PDF and enforces a size limit, so a renamed script or an oversized file never reaches storage.',
  },
  {
    icon: ShieldCheck,
    title: 'Streamed, not exposed',
    body: 'Files are stored on disk with only the path kept in the database, and are streamed back through an authenticated endpoint rather than a guessable public url.',
  },
]

const STACK = [
  {
    icon: MonitorSmartphone,
    layer: 'Presentation',
    tech: 'React, Vite, Tailwind CSS',
    body: 'A responsive single page app in a clean blue and white corporate style. React Query caches document lists so the dashboard feels instant.',
  },
  {
    icon: ServerCog,
    layer: 'Application',
    tech: 'Spring Boot, Spring Security',
    body: 'REST controllers, JWT authentication and a service layer that holds the business rules. The backend is the single authority and never trusts the client blindly.',
  },
  {
    icon: Layers3,
    layer: 'Domain',
    tech: 'Spring Data JPA',
    body: 'One documents entity with a type enum, plus branches and users. Specifications build the dynamic search, and every list is paginated with a capped page size.',
  },
  {
    icon: Database,
    layer: 'Storage',
    tech: 'MySQL and file storage',
    body: 'Indexed columns on date, branch and type keep filters fast at scale. PDF binaries live on disk or object storage, never as database blobs.',
  },
]

export default function ProposedSolutionPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="The solution"
        title="A secure, searchable system of record for every document."
        lead="The portal is built in clear layers, from a fast React interface down to an indexed MySQL store, with security enforced where it can actually be trusted: on the server."
      />

      <Container className="mt-14 space-y-16">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Design principles</p>
          <h2 className="mt-3 text-2xl font-extrabold text-brand-900">Four decisions that shape the system</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <Card key={title} interactive className="h-full">
                <span className="icon-tile h-11 w-11">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-brand-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-900/70">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Architecture</p>
          <h2 className="mt-3 text-2xl font-extrabold text-brand-900">Layer by layer</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-200">
            {STACK.map(({ icon: Icon, layer, tech, body }, i) => (
              <div
                key={layer}
                className="flex flex-col gap-4 border-b border-brand-100 bg-white p-6 last:border-b-0 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4 sm:w-72 sm:shrink-0">
                  <span className="icon-tile h-12 w-12 bg-brand-500 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-500">Layer {i + 1}</p>
                    <p className="text-base font-bold text-brand-900">{layer}</p>
                    <p className="text-xs text-brand-900/60">{tech}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-brand-900/70">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border-l-4 border-brand-500 bg-brand-50 p-8">
          <h2 className="text-lg font-bold text-brand-900">One table, three document types</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-brand-900/75">
            Circulars, orders and notifications share the same shape: a subject, a branch, an issue
            date and a file. Rather than three near identical tables, the system uses a single
            documents table with a type enum. That one decision makes search simpler, keeps indexes
            effective, and lets a single endpoint serve every kind of document.
          </p>
        </div>
      </Container>
    </div>
  )
}
