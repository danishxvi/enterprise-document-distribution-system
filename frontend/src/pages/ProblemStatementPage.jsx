import { AlertTriangle, Clock, FolderX, MailWarning, SearchX, ShieldAlert } from 'lucide-react'
import Card from '../components/ui/Card'
import SectionHeading from '../components/ui/SectionHeading'

// The problem this project set out to solve, told plainly. The pain points
// are the ones that show up whenever official documents live in inboxes and
// shared folders instead of a purpose built system.
const PAINS = [
  {
    icon: MailWarning,
    title: 'Documents live in email',
    body: 'Circulars and orders arrive as attachments in long email threads. Forwards multiply, versions diverge, and the authoritative copy becomes impossible to identify.',
  },
  {
    icon: SearchX,
    title: 'No real way to search',
    body: 'Finding a six month old order means scrolling inboxes and guessing keywords. There is no filter by branch, type or date, so retrieval is slow and unreliable.',
  },
  {
    icon: FolderX,
    title: 'Scattered shared drives',
    body: 'Files spread across personal folders and network drives with inconsistent naming. New staff have no idea where anything is, and nothing is truly the single source of truth.',
  },
  {
    icon: ShieldAlert,
    title: 'Weak access control',
    body: 'Anyone with a link or folder path can open sensitive internal documents. There is no clear line between who may publish and who may only read.',
  },
  {
    icon: Clock,
    title: 'Slow distribution',
    body: 'Getting a notification to the right branches depends on someone remembering the correct mailing list. Time sensitive notices reach people late or not at all.',
  },
  {
    icon: AlertTriangle,
    title: 'No safety on uploads',
    body: 'Nothing verifies that an attachment is genuinely the document it claims to be, or that it is a sane size, leaving room for mistakes and misuse.',
  },
]

export default function ProblemStatementPage() {
  return (
    <div className="animate-fade-in space-y-12 py-4">
      <SectionHeading
        eyebrow="The problem"
        title="Official documents were hard to distribute, and harder to find."
        lead="Large organisations issue a constant stream of circulars, orders and notifications. When those documents travel by email and shared drives, the organisation loses control of its own record. This is the situation the system was built to fix."
        tint="#DD6B20"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PAINS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="h-full">
            <span className="grid h-11 w-11 place-items-center rounded-neu-sm bg-surface text-accent-amber shadow-neu-inset">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-accent-amber/40">
        <h2 className="text-lg font-bold text-ink">In one sentence</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-muted">
          There was no secure, searchable, access controlled place where every
          official document could be published once and reliably found later, so
          the organisation depended on email and memory for something that
          deserved a system of record.
        </p>
      </Card>
    </div>
  )
}
