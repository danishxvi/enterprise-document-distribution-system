// A consistent page level heading used across the narrative pages so they
// share a rhythm: a small colored eyebrow, a bold title, then a lead line.
export default function SectionHeading({ eyebrow, title, lead, tint = '#3182CE' }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="text-sm font-semibold" style={{ color: tint }}>
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        {title}
      </h1>
      {lead && <p className="mt-4 text-base leading-relaxed text-ink-muted">{lead}</p>}
    </div>
  )
}
