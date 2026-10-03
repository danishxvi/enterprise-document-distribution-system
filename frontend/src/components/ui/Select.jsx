import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

// The native select is kept for accessibility and mobile behaviour; only the
// default arrow is swapped for a chevron in the brand blue.
const Select = forwardRef(function Select({ className, label, id, children, ...props }, ref) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn('field cursor-pointer appearance-none pr-11', className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500"
          aria-hidden="true"
        />
      </div>
    </div>
  )
})

export default Select
