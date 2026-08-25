import { cn } from '../../lib/cn'

// The workhorse button. It rests extruded, tightens its shadow on hover so
// it feels lightly pressed, and sinks to an inset state while active. That
// three step motion is what sells the soft, physical feel.

const VARIANTS = {
  // Neutral surface button.
  default: 'text-ink hover:text-ink',
  // Accent colored label for primary actions, still on the soft surface.
  primary: 'text-accent-blue font-semibold hover:text-accent-blue',
  teal: 'text-accent-teal font-semibold hover:text-accent-teal',
  danger: 'text-red-500 font-semibold hover:text-red-500',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-neu-sm bg-surface font-medium',
        'shadow-neu transition-all duration-200 ease-out',
        'hover:shadow-neu-sm active:shadow-neu-inset-sm active:translate-y-px',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-neu',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
