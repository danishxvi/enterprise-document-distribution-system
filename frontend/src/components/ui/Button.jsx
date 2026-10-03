import { cn } from '../../lib/cn'

// Variants cover the two surfaces the design uses: white pages and blue bands.
// `inverse` and `outlineInverse` are the ones meant to sit on a blue band.
const VARIANTS = {
  primary: 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600',
  secondary: 'bg-white text-brand-500 border-brand-500 hover:bg-brand-50',
  ghost: 'bg-transparent text-brand-500 border-transparent hover:bg-brand-50',
  inverse: 'bg-white text-brand-500 border-white hover:bg-brand-50 hover:border-brand-50',
  outlineInverse: 'bg-transparent text-white border-white/70 hover:bg-white/10 hover:border-white',
}

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

// Exported so router links can look exactly like buttons without nesting a
// button inside an anchor.
export function buttonClasses({ variant = 'primary', size = 'md', className } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl border font-semibold',
    'transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className
  )
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}
