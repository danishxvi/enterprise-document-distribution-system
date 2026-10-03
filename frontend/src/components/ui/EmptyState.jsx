import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'Try adjusting your filters or search terms.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-50 px-6 py-16 text-center">
      <span className="icon-tile h-14 w-14 bg-white">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-base font-bold text-brand-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-brand-900/70">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
