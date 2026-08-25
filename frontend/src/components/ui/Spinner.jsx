import { cn } from '../../lib/cn'

// A minimal ring spinner tinted with the enterprise blue accent.
export default function Spinner({ className, label = 'Loading' }) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          'h-6 w-6 animate-spin rounded-full border-2 border-accent-blue/25 border-t-accent-blue',
          className
        )}
      />
    </span>
  )
}
