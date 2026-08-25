import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

// A pressed input. The sunken shadow reads as an inviting well to type into
// and pairs with the extruded buttons around it.
const Input = forwardRef(function Input({ className, label, id, ...props }, ref) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'neu-inset w-full px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70',
          'transition-shadow duration-200 focus:shadow-neu-inset',
          className
        )}
        {...props}
      />
    </div>
  )
})

export default Input
