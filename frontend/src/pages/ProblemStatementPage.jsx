import { AlertTriangle, Clock, FolderX, MailWarning, SearchX, ShieldAlert } from 'lucide-react'
import Card from '../components/ui/Card'
import Container from '../components/layout/Container'
import PageHero from '../components/layout/PageHero'

// The pain points that appear whenever official documents live in inboxes
// and shared folders instead of a purpose built system.
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
    body: 'Nothing verifies that an attachment is genuinely the document it claims to be, or that it is a sensible size, leaving room for mistakes and misuse.',
  },
]

export default function ProblemStatementPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="The problem"
        title="Official documents were hard to distribute, and harder to find."
        lead="Large organisations issue a constant stream of circulars, orders and notifications. When those documents travel by email and shared drives, the organisation loses control of its own record."
      />

      <Container className="mt-14 space-y-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PAINS.map(({ icon: Icon, title, body }, i) => (
            <Card key={title} interactive className="h-full">
              <div className="flex items-center justify-between">
                <span className="icon-tile h-11 w-11">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-3xl font-extrabold text-brand-100">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-brand-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-900/70">{body}</p>
            </Card>
          ))}
        </div>

        <div className="rounded-2xl border-l-4 border-brand-500 bg-brand-50 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">In one sentence</p>
          <p className="mt-3 max-w-4xl text-lg leading-relaxed text-brand-900">
            There was no secure, searchable, access controlled place where every official document
            could be published once and reliably found later, so the organisation depended on email
            and memory for something that deserved a system of record.
          </p>
        </div>
      </Container>
    </div>
  )
}
