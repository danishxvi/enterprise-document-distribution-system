import { CheckCircle2, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

// Inline status message. Success and error share the blue palette and differ
// by icon and weight, which keeps the interface within its two colours while
// still making a problem obvious.
export default function Notice({ tone = 'info', children, className }) {
  const isError = tone === 'error'
  const Icon = tone === 'success' ? CheckCircle2 : Info
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        isError
          ? 'border-brand-500 bg-brand-50 font-semibold text-brand-900'
          : 'border-brand-200 bg-brand-50 text-brand-700',
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
