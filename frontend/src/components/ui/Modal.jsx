import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

// Centered dialog in a portal. Locks body scroll, closes on Escape and on a
// backdrop click.
export default function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-brand-900/60" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 flex max-h-[92vh] w-full max-w-3xl animate-scale-in flex-col overflow-hidden rounded-2xl bg-white shadow-panel',
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-100 px-6 py-4">
          <h2 className="text-lg font-bold leading-snug text-brand-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-brand-200 text-brand-500 transition hover:border-brand-500 hover:bg-brand-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}
