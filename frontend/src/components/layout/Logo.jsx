import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

// Wordmark: a blue tile with a document glyph, then the name. `inverse`
// renders it for use on a blue background.
export default function Logo({ inverse = false, className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-3', className)} aria-label="Home">
      <span
        className={cn(
          'grid h-10 w-10 place-items-center rounded-xl',
          inverse ? 'bg-white text-brand-500' : 'bg-brand-500 text-white'
        )}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <rect x="5" y="3" width="14" height="18" rx="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={cn('block text-sm font-extrabold', inverse ? 'text-white' : 'text-brand-900')}>
          Document Distribution
        </span>
        <span className={cn('block text-xs font-semibold', inverse ? 'text-white/75' : 'text-brand-500')}>
          Enterprise Portal
        </span>
      </span>
    </Link>
  )
}
