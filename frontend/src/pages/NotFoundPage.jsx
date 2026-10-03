import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { buttonClasses } from '../components/ui/Button'
import Container from '../components/layout/Container'

export default function NotFoundPage() {
  return (
    <Container className="grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="animate-fade-in">
        <span className="icon-tile mx-auto h-20 w-20 bg-brand-500 text-white">
          <Compass className="h-9 w-9" />
        </span>
        <p className="mt-6 text-6xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-900">Page not found</h1>
        <p className="mt-3 text-base text-brand-900/70">That page does not exist, or has been retired.</p>
        <Link to="/" className={buttonClasses({ className: 'mt-8' })}>
          Back to home
        </Link>
      </div>
    </Container>
  )
}
