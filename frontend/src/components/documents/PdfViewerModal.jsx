import { useEffect, useState } from 'react'
import { Building2, CalendarDays, FileText, ShieldCheck } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import Notice from '../ui/Notice'
import TypeBadge from '../ui/Badge'
import { api, errorMessage } from '../../lib/api'
import { USE_MOCK_API } from '../../lib/constants'

function formatDate(value) {
  try {
    return format(parseISO(value), 'dd MMMM yyyy')
  } catch {
    return value
  }
}

// Opens a document without leaving the page. Against the real backend the
// protected stream is fetched as a blob, so the auth header rides along, and
// shown in an iframe. In mock mode there is no real file, so a placeholder
// page is drawn instead of a broken viewer.
export default function PdfViewerModal({ doc, open, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !doc || USE_MOCK_API) return undefined
    let objectUrl = null
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .fetchDocumentBlob(doc.id)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)
      })
      .catch((err) => !cancelled && setError(errorMessage(err, 'This document could not be loaded.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setBlobUrl(null)
    }
  }, [open, doc])

  if (!doc) return null
  const issued = formatDate(doc.issueDate)

  return (
    <Modal open={open} onClose={onClose} title={doc.subject}>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-900/70">
        <TypeBadge type={doc.docType} />
        <span className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-brand-500" /> {doc.branchName}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-brand-500" /> {issued}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-200 bg-brand-50">
        {USE_MOCK_API ? (
          <PlaceholderPage doc={doc} issued={issued} />
        ) : loading ? (
          <div className="grid h-[60vh] place-items-center text-brand-500">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="grid h-[60vh] place-items-center p-6">
            <Notice tone="error">{error}</Notice>
          </div>
        ) : (
          blobUrl && <iframe title={doc.subject} src={blobUrl} className="h-[60vh] w-full bg-white" />
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-brand-900/70">
        <ShieldCheck className="h-4 w-4 shrink-0 text-brand-500" />
        Streamed through an authenticated endpoint. The file is never exposed by a public url.
      </p>
    </Modal>
  )
}

// Stand in for a real PDF during demos, so the viewer looks complete without
// shipping sample binaries.
function PlaceholderPage({ doc, issued }) {
  return (
    <div className="grid h-[60vh] place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border border-brand-200 bg-white p-8">
        <div className="flex items-center gap-3 border-b border-brand-100 pb-4">
          <span className="icon-tile h-10 w-10">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{doc.docType}</p>
            <p className="text-sm font-semibold text-brand-900">{doc.branchName}</p>
          </div>
        </div>
        <h4 className="mt-5 text-base font-bold text-brand-900">{doc.subject}</h4>
        <p className="mt-1 text-xs text-brand-900/60">Issued {issued}</p>
        <div className="mt-6 space-y-2.5">
          {[100, 92, 96, 78, 88, 60].map((w, i) => (
            <div key={i} className="h-2.5 rounded-full bg-brand-100" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-brand-900/60">
          Sample preview. Connect the backend to stream the real document.
        </p>
      </div>
    </div>
  )
}
