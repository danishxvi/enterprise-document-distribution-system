import { cn } from '../../lib/cn'

// An extruded surface. `interactive` adds the subtle press-in-on-hover
// motion used by clickable document cards; static containers leave it off.
export default function Card({ children, className, interactive = false, ...props }) {
  return (
    <div
      className={cn(
        'neu-card p-6',
        interactive &&
          'transition-all duration-200 ease-out hover:shadow-neu-sm hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
