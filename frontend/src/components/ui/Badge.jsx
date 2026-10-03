import { DOC_TYPE_STYLES } from '../../lib/constants'
import { cn } from '../../lib/cn'

// Document type label. With only blue and white available, the three types
// read as solid, tinted and outlined chips instead of three different hues.
export default function TypeBadge({ type, className }) {
  const style = DOC_TYPE_STYLES[type] ?? {
    label: type,
    className: 'bg-brand-50 text-brand-700 border-brand-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        style.className,
        className
      )}
    >
      {style.label}
    </span>
  )
}
