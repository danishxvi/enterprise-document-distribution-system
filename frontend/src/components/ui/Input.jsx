import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const Input = forwardRef(function Input({ className, label, id, ...props }, ref) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <input ref={ref} id={id} className={cn('field', className)} {...props} />
    </div>
  )
})

export default Input
