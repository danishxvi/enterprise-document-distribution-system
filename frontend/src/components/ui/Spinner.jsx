import { cn } from '../../lib/cn'

export default function Spinner({ className, label = 'Loading' }) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          'h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80',
          className
        )}
      />
    </span>
  )
}
