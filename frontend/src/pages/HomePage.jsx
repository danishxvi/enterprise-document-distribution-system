import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileSearch,
  LockKeyhole,
  ScrollText,
  Search,
  Timer,
  Users,
} from 'lucide-react'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'

// The front door. It frames what the portal is, shows the three document
// types it unifies, and points signed in users straight to their dashboard.
const FEATURES = [
  {
    icon: Search,
    title: 'Find anything fast',
    body: 'Filter by type, branch and date range, or search subjects directly. Results come back in chunks so the page stays quick.',
    tint: '#3182CE',
  },
  {
    icon: LockKeyhole,
    title: 'Secure by default',
    body: 'Role based access, validated uploads and documents streamed through authenticated endpoints rather than public links.',
    tint: '#38B2AC',
  },
  {
    icon: FileSearch,
    title: 'Read in place',
    body: 'Open any document in a clean viewer without downloading it or losing your spot in the list.',
    tint: '#DD6B20',
  },
]

const TYPES = [
  { icon: ScrollText, label: 'Circulars', note: 'Policy and guidance' },
  { icon: Users, label: 'Orders', note: 'Postings and sanctions' },
  { icon: Timer, label: 'Notifications', note: 'Time sensitive notices' },
]

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const primaryTo = isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'
  const primaryLabel = isAuthenticated ? 'Go to dashboard' : 'Sign in to continue'

  return (
    <div className="animate-fade-in space-y-16 py-4">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-accent-blue shadow-neu-inset">
            Enterprise internal communication
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            One home for every circular, order and notification.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            The Enterprise Document Distribution System replaces scattered email
            threads and shared drives with a single, searchable, access
            controlled library. Publish once, and the right people can always
            find it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={primaryTo}
              className="inline-flex items-center gap-2 rounded-neu-sm bg-surface px-7 py-3 text-sm font-semibold text-accent-blue shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/proposed-solution"
              className="inline-flex items-center gap-2 rounded-neu-sm bg-surface px-7 py-3 text-sm font-semibold text-ink shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* A small visual: the three document types as extruded tiles. */}
        <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
          {TYPES.map(({ icon: Icon, label, note }) => (
            <Card key={label} className="flex flex-col items-start gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-neu-sm bg-surface text-accent-blue shadow-neu-inset">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{label}</p>
                <p className="text-xs text-ink-muted">{note}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature triad */}
      <section>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, tint }) => (
            <Card key={title} className="h-full">
              <span
                className="grid h-12 w-12 place-items-center rounded-neu-sm bg-surface shadow-neu-inset"
                style={{ color: tint }}
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing call to the narrative pages */}
      <section className="rounded-neu bg-surface p-8 shadow-neu sm:p-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold text-ink">
              Built from a real internal need.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Read the problem this system was designed to solve and the approach
              taken to solve it well.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/problem-statement"
              className="rounded-neu-sm bg-surface px-6 py-3 text-sm font-semibold text-ink shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
            >
              The problem
            </Link>
            <Link
              to="/proposed-solution"
              className="rounded-neu-sm bg-surface px-6 py-3 text-sm font-semibold text-accent-blue shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
            >
              The solution
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
