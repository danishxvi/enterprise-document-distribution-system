import { cn } from '../../lib/cn'

// The page column. Bands can stretch edge to edge while their content stays
// aligned to this same max width.
export default function Container({ children, className }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}
