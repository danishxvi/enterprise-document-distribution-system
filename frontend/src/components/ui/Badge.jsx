import { DOC_TYPE_STYLES } from '../../lib/constants'

// A quiet type badge. Instead of a loud filled pill it uses a soft tinted
// surface, a colored dot and colored text so it stays gentle on the
// low contrast neumorphic background.
export default function TypeBadge({ type }) {
  const style = DOC_TYPE_STYLES[type] ?? {
    label: type,
    text: '#4A5568',
    dot: '#718096',
  }
  return (
    <span
      className="neu-badge"
      style={{
        color: style.text,
        backgroundColor: `${style.dot}1a`, // ~10% tint of the accent
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
        aria-hidden="true"
      />
      {style.label}
    </span>
  )
}
