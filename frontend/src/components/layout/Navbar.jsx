import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, ShieldCheck, User, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/cn'
import { buttonClasses } from '../ui/Button'
import Container from './Container'
import Logo from './Logo'

const PUBLIC_LINKS = [
  { to: '/problem-statement', label: 'Problem' },
  { to: '/proposed-solution', label: 'Solution' },
  { to: '/about-developer', label: 'Developer' },
]

// Active links get a blue underline bar, the way corporate sites mark the
// current section.
function desktopLinkClass({ isActive }) {
  return cn(
    'relative px-1 py-6 text-sm font-semibold transition-colors',
    'after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t after:bg-brand-500 after:transition-opacity',
    isActive
      ? 'text-brand-500 after:opacity-100'
      : 'text-brand-900/75 after:opacity-0 hover:text-brand-500'
  )
}

function mobileLinkClass({ isActive }) {
  return cn(
    'rounded-xl px-4 py-3 text-sm font-semibold',
    isActive ? 'bg-brand-500 text-white' : 'text-brand-900 hover:bg-brand-50'
  )
}

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [...PUBLIC_LINKS]
  if (isAuthenticated) {
    links.unshift({ to: '/dashboard', label: 'Documents' })
    if (isAdmin) links.splice(1, 0, { to: '/admin', label: 'Admin' })
  }

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-6">
        <Logo className="py-3" />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm">
                {isAdmin ? (
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                ) : (
                  <User className="h-4 w-4 text-brand-500" />
                )}
                <span className="font-semibold text-brand-900">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out"
                title="Sign out"
                className="grid h-10 w-10 place-items-center rounded-xl border border-brand-200 text-brand-500 transition hover:border-brand-500 hover:bg-brand-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/login" className={buttonClasses({ size: 'sm' })}>
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl border border-brand-200 text-brand-500 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-brand-100 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={mobileLinkClass}>
                {link.label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-brand-100" />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-brand-500 hover:bg-brand-50"
              >
                <LogOut className="h-4 w-4" /> Sign out ({user.name})
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className={buttonClasses({ className: 'w-full' })}>
                Sign in
              </Link>
            )}
          </Container>
        </div>
      )}
    </header>
  )
}
