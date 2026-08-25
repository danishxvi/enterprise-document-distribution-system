import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

// A pressed select. The native control is kept for accessibility and mobile
// behaviour, with a custom chevron layered on top and the default arrow
// hidden so it matches the soft aesthetic.
const Select = forwardRef(function Select(
  { className, label, id, children, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            'neu-inset w-full appearance-none px-4 py-3 pr-11 text-sm text-ink',
            'cursor-pointer transition-shadow duration-200 focus:shadow-neu-inset',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  )
})

export default Select
