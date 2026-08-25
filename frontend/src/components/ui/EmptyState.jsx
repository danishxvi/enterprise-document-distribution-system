import { Inbox } from 'lucide-react'

// Shown when a filter set returns nothing. A recessed icon well keeps it in
// keeping with the soft surface rather than an abrupt blank.
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'Try adjusting your filters or search terms.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-neu bg-surface px-6 py-16 text-center shadow-neu">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-muted shadow-neu-inset">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
