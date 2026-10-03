import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileSearch,
  FileText,
  LockKeyhole,
  ScrollText,
  Search,
  Timer,
  Upload,
  Users,
} from 'lucide-react'
import Card from '../components/ui/Card'
import TypeBadge from '../components/ui/Badge'
import { buttonClasses } from '../components/ui/Button'
import Container from '../components/layout/Container'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  {
    icon: Search,
    title: 'Find anything fast',
    body: 'Filter by type, branch and date range, or search subjects directly. Results come back a page at a time so the screen stays quick.',
  },
  {
    icon: LockKeyhole,
    title: 'Secure by default',
    body: 'Role based access, uploads verified by their real file type, and documents streamed through authenticated endpoints rather than public links.',
  },
  {
    icon: FileSearch,
    title: 'Read in place',
    body: 'Open any document in a viewer without downloading it or losing your place in the list.',
  },
]

const TYPES = [
  { icon: ScrollText, label: 'Circulars', note: 'Policy and guidance for every branch' },
  { icon: Users, label: 'Orders', note: 'Postings, transfers and sanctions' },
  { icon: Timer, label: 'Notifications', note: 'Time sensitive operational notices' },
]

const STEPS = [
  { icon: Upload, title: 'Publish', body: 'An administrator uploads a PDF with its subject, type, branch and issue date.' },
  { icon: Search, title: 'Discover', body: 'Employees search and filter the shared library to find what applies to them.' },
  { icon: FileText, title: 'Read', body: 'The document opens in place, streamed securely to signed in users only.' },
]

// A static preview of the library for the hero panel.
const PREVIEW = [
  { type: 'CIRCULAR', subject: 'Revised guidelines for annual maintenance shutdown windows', meta: 'Operations' },
  { type: 'ORDER', subject: 'Transfer and posting of technical staff, third quarter', meta: 'Human Resources' },
  { type: 'NOTIFICATION', subject: 'Scheduled power block on the eastern corridor', meta: 'Engineering' },
]

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const primaryTo = isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'
  const primaryLabel = isAuthenticated ? 'Go to dashboard' : 'Sign in to continue'

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-500 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-3xl bg-white/5" />
        <div aria-hidden="true" className="pointer-events-none absolute right-1/3 top-10 hidden h-20 w-20 rounded-2xl border-2 border-white/20 lg:block" />

        <Container className="relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in">
            <span className="inline-flex rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">
              Enterprise internal communication
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl">
              One home for every circular, order and notification.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Replace scattered email threads and shared drives with a single,
              searchable, access controlled library. Publish once, and the right
              people can always find it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={primaryTo} className={buttonClasses({ variant: 'inverse', size: 'lg' })}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/proposed-solution" className={buttonClasses({ variant: 'outlineInverse', size: 'lg' })}>
                How it works
              </Link>
            </div>
          </div>

          {/* Library preview panel */}
          <div className="animate-fade-in rounded-2xl bg-white p-6 text-brand-900 shadow-panel">
            <div className="flex items-center justify-between border-b border-brand-100 pb-4">
              <p className="text-sm font-bold">Latest in the library</p>
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-500">Live</span>
            </div>
            <ul className="divide-y divide-brand-100">
              {PREVIEW.map((item) => (
                <li key={item.subject} className="flex items-start gap-4 py-4">
                  <span className="icon-tile h-10 w-10">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.subject}</p>
                    <p className="mt-0.5 text-xs text-brand-900/60">{item.meta}</p>
                  </div>
                  <TypeBadge type={item.type} className="hidden sm:inline-flex" />
                </li>
              ))}
            </ul>
            <Link to={primaryTo} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-700">
              Open the full library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Document types */}
      <Container className="-mt-10 relative">
        <div className="grid gap-4 sm:grid-cols-3">
          {TYPES.map(({ icon: Icon, label, note }) => (
            <Card key={label} className="flex items-center gap-4 shadow-card">
              <span className="icon-tile h-12 w-12 bg-brand-500 text-white">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-base font-bold text-brand-900">{label}</p>
                <p className="text-sm text-brand-900/65">{note}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* Features */}
      <Container className="mt-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Why it works</p>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-900">Built for the way documents actually move</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} interactive className="h-full">
              <span className="icon-tile h-12 w-12">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-brand-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-900/70">{body}</p>
            </Card>
          ))}
        </div>
      </Container>

      {/* How it works */}
      <section className="mt-20 bg-brand-50 py-16">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold text-brand-900">Three steps from upload to reader</h2>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-2xl border border-brand-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="icon-tile h-12 w-12">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-extrabold text-brand-100">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-900/70">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Closing band */}
      <Container className="mt-20">
        <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-white sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-3xl bg-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold sm:text-3xl">Built from a real internal need.</h2>
              <p className="mt-2 text-white/85">
                Read the problem this system was designed to solve, and the approach taken to solve it well.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/problem-statement" className={buttonClasses({ variant: 'outlineInverse' })}>
                The problem
              </Link>
              <Link to="/proposed-solution" className={buttonClasses({ variant: 'inverse' })}>
                The solution
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
