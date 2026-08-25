import { Link } from 'react-router-dom'

// The wordmark. A small extruded tile holding a document glyph, paired with
// the full name and a short tag so the brand reads clearly in the nav bar.
export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-neu-sm bg-surface shadow-neu">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <rect
            x="5"
            y="3"
            width="14"
            height="18"
            rx="2.5"
            fill="none"
            stroke="#3182CE"
            strokeWidth="1.8"
          />
          <line x1="8.5" y1="8" x2="15.5" y2="8" stroke="#718096" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8.5" y1="11.5" x2="15.5" y2="11.5" stroke="#718096" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8.5" y1="15" x2="13" y2="15" stroke="#38B2AC" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-extrabold tracking-tight text-ink">
            Document Distribution
          </span>
          <span className="block text-xs font-medium text-ink-muted">
            Enterprise Portal
          </span>
        </span>
      )}
    </Link>
  )
}
