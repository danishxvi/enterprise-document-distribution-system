import { cn } from '../../lib/cn'

// A white, rounded box with a thin blue border. `interactive` adds the hover
// state used by clickable tiles: the border firms up and a soft blue lift
// appears underneath.
export default function Card({ children, className, interactive = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-200 bg-white p-6',
        interactive &&
          'transition duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
