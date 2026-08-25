import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

// A calm dead end. Keeps the soft look and offers a single clear way back.
export default function NotFoundPage() {
  return (
    <div className="animate-fade-in grid min-h-[60vh] place-items-center py-12 text-center">
      <div>
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-neu bg-surface text-accent-blue shadow-neu-inset">
          <Compass className="h-9 w-9" />
        </span>
        <h1 className="mt-6 text-5xl font-extrabold text-ink">404</h1>
        <p className="mt-3 text-base text-ink-muted">
          That page does not exist, or has been retired.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-neu-sm bg-surface px-7 py-3 text-sm font-semibold text-accent-blue shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
