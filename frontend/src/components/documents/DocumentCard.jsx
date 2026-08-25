import { Building2, CalendarDays, Eye, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Card from '../ui/Card'
import Button from '../ui/Button'
import TypeBadge from '../ui/Badge'

// A single document tile. It leads with the type badge, gives the subject
// room to breathe as the headline, then footnotes the branch and date. The
// view action is always present; delete only shows for admins.
export default function DocumentCard({ doc, onView, onDelete, canDelete }) {
  let issued = doc.issueDate
  try {
    issued = format(parseISO(doc.issueDate), 'dd MMM yyyy')
  } catch {
    // keep the raw value if it is not a parseable ISO date
  }

  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <TypeBadge type={doc.docType} />
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete?.(doc)}
            aria-label="Delete document"
            className="grid h-8 w-8 place-items-center rounded-full bg-surface text-ink-muted shadow-neu transition-all hover:text-red-500 hover:shadow-neu-sm active:shadow-neu-inset-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <h3 className="mt-4 line-clamp-3 text-base font-bold leading-snug text-ink">
        {doc.subject}
      </h3>

      <dl className="mt-4 space-y-2 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0" />
          <dt className="sr-only">Branch</dt>
          <dd>{doc.branchName}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <dt className="sr-only">Issue date</dt>
          <dd>{issued}</dd>
        </div>
      </dl>

      <div className="mt-6 flex-1" />
      <Button variant="primary" size="sm" onClick={() => onView?.(doc)} className="w-full">
        <Eye className="h-4 w-4" />
        View PDF
      </Button>
    </Card>
  )
}
