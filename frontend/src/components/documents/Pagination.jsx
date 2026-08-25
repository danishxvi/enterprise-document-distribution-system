import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

// Compact pager. It shows a small window of page numbers around the current
// page so the control stays tidy even with hundreds of pages.
function pageWindow(current, total) {
  const pages = []
  const start = Math.max(0, Math.min(current - 1, total - 3))
  const end = Math.min(total, start + 3)
  for (let i = start; i < end; i += 1) pages.push(i)
  return pages
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = pageWindow(page, totalPages)

  const arrow =
    'grid h-10 w-10 place-items-center rounded-neu-sm bg-surface text-ink shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm disabled:opacity-40 disabled:shadow-neu'

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        className={arrow}
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages[0] > 0 && <span className="px-1 text-ink-muted">...</span>}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'h-10 w-10 rounded-neu-sm bg-surface text-sm font-semibold transition-all',
            p === page
              ? 'text-accent-blue shadow-neu-inset'
              : 'text-ink-muted shadow-neu hover:shadow-neu-sm active:shadow-neu-inset-sm'
          )}
        >
          {p + 1}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages - 1 && (
        <span className="px-1 text-ink-muted">...</span>
      )}

      <button
        type="button"
        className={arrow}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
