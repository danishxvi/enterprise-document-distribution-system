import {
  Database,
  FileCheck2,
  Filter,
  KeyRound,
  Layers3,
  MonitorSmartphone,
  ServerCog,
  ShieldCheck,
} from 'lucide-react'
import Card from '../components/ui/Card'
import SectionHeading from '../components/ui/SectionHeading'

// The approach taken, laid out as the layered architecture plus the design
// decisions that matter. It reads as a walk from the browser down to storage.
const PILLARS = [
  {
    icon: KeyRound,
    title: 'Role based access',
    body: 'A stateless JWT session identifies every request. Admins may publish and retire documents; employees may read. Protected routes enforce this on both the client and the server.',
    tint: '#3182CE',
  },
  {
    icon: Filter,
    title: 'One dynamic search',
    body: 'A single endpoint accepts optional filters for type, branch and date range using JPA Specifications, so any combination works without a separate query for each case.',
    tint: '#38B2AC',
  },
  {
    icon: FileCheck2,
    title: 'Validated uploads',
    body: 'The backend reads the real file header with Apache Tika to confirm a PDF, and caps the size, so a renamed script or an oversized file never reaches storage.',
    tint: '#DD6B20',
  },
  {
    icon: ShieldCheck,
    title: 'Streamed, not exposed',
    body: 'Files are stored on disk with only the path kept in the database. Documents are streamed back through an authenticated endpoint rather than a guessable public url.',
    tint: '#3182CE',
  },
]

const STACK = [
  {
    icon: MonitorSmartphone,
    layer: 'Presentation',
    tech: 'React, Vite, Tailwind CSS',
    body: 'A responsive single page app with a soft, neumorphic interface. React Query caches document lists so the dashboard feels instant.',
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
    body: 'A single documents entity with a type enum, plus branches and users. Specifications build the dynamic search, and Pageable keeps every list paginated.',
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
    <div className="animate-fade-in space-y-14 py-4">
      <SectionHeading
        eyebrow="The solution"
        title="A secure, searchable system of record for every document."
        lead="The portal is built in clear layers, from a fast React interface down to an indexed MySQL store, with security enforced at the layer that can actually be trusted: the server. Here is how the pieces fit together."
        tint="#38B2AC"
      />

      {/* Design pillars */}
      <section>
        <h2 className="mb-6 text-lg font-bold text-ink">Design principles</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, body, tint }) => (
            <Card key={title} className="h-full">
              <span
                className="grid h-11 w-11 place-items-center rounded-neu-sm bg-surface shadow-neu-inset"
                style={{ color: tint }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Layered architecture */}
      <section>
        <h2 className="mb-6 text-lg font-bold text-ink">The architecture, layer by layer</h2>
        <div className="space-y-4">
          {STACK.map(({ icon: Icon, layer, tech, body }, i) => (
            <Card key={layer} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
                <span className="grid h-12 w-12 place-items-center rounded-neu-sm bg-surface text-accent-blue shadow-neu-inset">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Layer {i + 1}
                  </p>
                  <p className="text-base font-bold text-ink">{layer}</p>
                  <p className="text-xs text-accent-teal">{tech}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Data model note */}
      <Card className="border-l-4 border-accent-teal/40">
        <h2 className="text-lg font-bold text-ink">One table, three document types</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Circulars, orders and notifications share the same shape: a subject, a
          branch, an issue date and a file. Rather than three near identical
          tables, the system uses a single documents table with a type enum. That
          one decision makes search simpler, keeps indexes effective, and lets a
          single endpoint serve every kind of document.
        </p>
      </Card>
    </div>
  )
}
