import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

// Shows a small window of page numbers around the current page so the
// control stays tidy even with hundreds of pages.
function pageWindow(current, total) {
  const pages = []
  const start = Math.max(0, Math.min(current - 1, total - 3))
  const end = Math.min(total, start + 3)
  for (let i = start; i < end; i += 1) pages.push(i)
  return pages
}

const box =
  'grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm font-semibold transition'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = pageWindow(page, totalPages)

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        className={cn(box, 'border-brand-200 bg-white text-brand-500 hover:border-brand-500 disabled:opacity-40 disabled:hover:border-brand-200')}
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages[0] > 0 && <span className="px-1 text-brand-900/50">...</span>}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            box,
            p === page
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-brand-200 bg-white text-brand-900 hover:border-brand-500 hover:text-brand-500'
          )}
        >
          {p + 1}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-brand-900/50">...</span>}

      <button
        type="button"
        className={cn(box, 'border-brand-200 bg-white text-brand-500 hover:border-brand-500 disabled:opacity-40 disabled:hover:border-brand-200')}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
