import { Link } from 'react-router-dom'
import Container from './Container'
import Logo from './Logo'

const COLUMNS = [
  {
    heading: 'Project',
    links: [
      { to: '/problem-statement', label: 'Problem statement' },
      { to: '/proposed-solution', label: 'Proposed solution' },
      { to: '/about-developer', label: 'About the developer' },
    ],
  },
  {
    heading: 'Access',
    links: [
      { to: '/dashboard', label: 'Document library' },
      { to: '/admin', label: 'Admin console' },
      { to: '/login', label: 'Sign in' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-brand-900 text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo inverse />
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            A secure, searchable home for internal circulars, orders and
            notifications. Publish once, and the right people can always find it.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">{col.heading}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/85 transition hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 text-xs text-white/60">
          Copyright {year} Danish Husain. Built for internal enterprise communication.
        </Container>
      </div>
    </footer>
  )
}
