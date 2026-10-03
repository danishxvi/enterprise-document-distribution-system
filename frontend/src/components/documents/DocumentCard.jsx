import { ArrowRight, Building2, CalendarDays, FileText, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Card from '../ui/Card'
import TypeBadge from '../ui/Badge'

function formatDate(value) {
  try {
    return format(parseISO(value), 'dd MMM yyyy')
  } catch {
    return value
  }
}

// One document tile. The whole top area reads as a summary; the footer row
// holds the actions so they always line up across a grid of cards.
export default function DocumentCard({ doc, onView, onDelete, canDelete }) {
  return (
    <Card interactive className="flex h-full flex-col p-0">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="icon-tile h-11 w-11">
            <FileText className="h-5 w-5" />
          </span>
          <TypeBadge type={doc.docType} />
        </div>

        <h3 className="mt-5 line-clamp-3 text-base font-bold leading-snug text-brand-900">
          {doc.subject}
        </h3>

        <dl className="mt-4 space-y-2 text-sm text-brand-900/70">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-brand-500" />
            <dt className="sr-only">Branch</dt>
            <dd>{doc.branchName}</dd>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-brand-500" />
            <dt className="sr-only">Issue date</dt>
            <dd>{formatDate(doc.issueDate)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center gap-2 border-t border-brand-100 px-6 py-4">
        <button
          type="button"
          onClick={() => onView?.(doc)}
          className="group inline-flex flex-1 items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-700"
        >
          View document
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete?.(doc)}
            aria-label={`Retire ${doc.subject}`}
            title="Retire document"
            className="grid h-9 w-9 place-items-center rounded-lg border border-brand-200 text-brand-500 transition hover:border-brand-500 hover:bg-brand-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </Card>
  )
}
