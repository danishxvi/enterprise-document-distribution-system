import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, ShieldCheck, User, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/cn'
import Logo from './Logo'

// The public navigation links. Dashboard and admin entries are added at
// render time based on the signed in role.
const PUBLIC_LINKS = [
  { to: '/problem-statement', label: 'Problem' },
  { to: '/proposed-solution', label: 'Solution' },
  { to: '/about-developer', label: 'Developer' },
]

function navClass({ isActive }) {
  return cn(
    'rounded-neu-sm px-4 py-2 text-sm font-medium transition-all duration-200',
    isActive
      ? 'text-accent-blue shadow-neu-inset-sm'
      : 'text-ink-muted hover:text-ink hover:shadow-neu-sm'
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
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 rounded-neu-sm bg-surface px-4 py-2 text-sm shadow-neu-inset">
                {isAdmin ? (
                  <ShieldCheck className="h-4 w-4 text-accent-teal" />
                ) : (
                  <User className="h-4 w-4 text-accent-blue" />
                )}
                <span className="font-semibold text-ink">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out"
                className="grid h-10 w-10 place-items-center rounded-neu-sm bg-surface text-ink-muted shadow-neu transition-all hover:text-red-500 hover:shadow-neu-sm active:shadow-neu-inset-sm"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-neu-sm bg-surface px-5 py-2.5 text-sm font-semibold text-accent-blue shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-neu-sm bg-surface text-ink shadow-neu active:shadow-neu-inset-sm md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 md:hidden">
          <div className="flex flex-col gap-2 rounded-neu bg-surface p-4 shadow-neu">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={navClass}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="my-1 h-px bg-slate-300/40" />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-neu-sm px-4 py-2 text-sm font-semibold text-red-500"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-neu-sm px-4 py-2 text-sm font-semibold text-accent-blue"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
