import { useEffect, useState } from 'react'
import { FileText, ShieldCheck } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import TypeBadge from '../ui/Badge'
import { api, client } from '../../lib/api'
import { USE_MOCK_API } from '../../lib/constants'

// Opens a document without leaving the flow. Against the real backend it
// pulls the protected stream as a blob (so the auth header rides along) and
// shows it in an iframe. In mock mode there is no real file, so it renders a
// faithful placeholder page instead of a broken viewer.
export default function PdfViewerModal({ doc, open, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !doc || USE_MOCK_API) return
    let revoke = null
    setLoading(true)
    setError(null)
    client
      .get(api.viewUrl(doc.id), { responseType: 'blob' })
      .then((res) => {
        const url = URL.createObjectURL(res.data)
        revoke = url
        setBlobUrl(url)
      })
      .catch(() => setError('This document could not be loaded.'))
      .finally(() => setLoading(false))
    return () => {
      if (revoke) URL.revokeObjectURL(revoke)
      setBlobUrl(null)
    }
  }, [open, doc])

  if (!doc) return null

  let issued = doc.issueDate
  try {
    issued = format(parseISO(doc.issueDate), 'dd MMMM yyyy')
  } catch {
    // keep raw value
  }

  return (
    <Modal open={open} onClose={onClose} title={doc.subject}>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
        <TypeBadge type={doc.docType} />
        <span>{doc.branchName}</span>
        <span aria-hidden="true">/</span>
        <span>{issued}</span>
      </div>

      <div className="neu-inset overflow-hidden rounded-neu-sm">
        {USE_MOCK_API ? (
          <PlaceholderPage doc={doc} issued={issued} />
        ) : loading ? (
          <div className="grid h-[60vh] place-items-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="grid h-[60vh] place-items-center px-6 text-center text-sm text-ink-muted">
            {error}
          </div>
        ) : (
          <iframe
            title={doc.subject}
            src={blobUrl}
            className="h-[60vh] w-full bg-white"
          />
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
        <ShieldCheck className="h-4 w-4 text-accent-teal" />
        Streamed through an authenticated endpoint. The file is never exposed
        by a public url.
      </p>
    </Modal>
  )
}

// A quiet stand in that mimics a document page. It exists so the neumorphic
// viewer looks complete during demos without shipping sample PDF binaries.
function PlaceholderPage({ doc, issued }) {
  return (
    <div className="grid h-[60vh] place-items-center bg-white/60 p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-inner">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <FileText className="h-8 w-8 text-accent-blue" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {doc.docType}
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {doc.branchName}
            </p>
          </div>
        </div>
        <h4 className="mt-5 text-base font-bold text-slate-800">{doc.subject}</h4>
        <p className="mt-1 text-xs text-slate-400">Issued {issued}</p>
        <div className="mt-6 space-y-2.5">
          {[100, 92, 96, 78, 88, 60].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-slate-100"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          Sample preview. Connect the backend to stream the real document.
        </p>
      </div>
    </div>
  )
}
