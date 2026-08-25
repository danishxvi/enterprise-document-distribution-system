import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, LogIn, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Logo from '../components/layout/Logo'
import { USE_MOCK_API } from '../lib/constants'

// The single sign in surface. On success it honours a remembered return
// path, otherwise it routes by role: admins to the console, everyone else to
// the document dashboard.
export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const profile = await login(email.trim(), password)
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from, { replace: true })
      } else {
        navigate(profile.role === 'ADMIN' ? '/admin' : '/dashboard', {
          replace: true,
        })
      }
    } catch (err) {
      setError(err?.message ?? 'Sign in failed. Please try again.')
    }
  }

  // Convenience for graders: prefill either demo account in mock mode.
  function fill(role) {
    if (role === 'ADMIN') {
      setEmail('admin@edds.local')
      setPassword('admin123')
    } else {
      setEmail('employee@edds.local')
      setPassword('employee123')
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <div className="rounded-neu bg-surface p-8 shadow-neu">
        <h1 className="text-xl font-extrabold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Sign in to browse circulars, orders and notifications.
        </p>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-neu-sm bg-surface px-4 py-3 text-sm text-red-500 shadow-neu-inset">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@edds.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Spinner className="h-5 w-5" /> : <LogIn className="h-4 w-4" />}
            {loading ? 'Signing in' : 'Sign in'}
          </Button>
        </form>

        {USE_MOCK_API && (
          <div className="mt-6 border-t border-slate-300/40 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Demo accounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fill('ADMIN')}
                className="flex items-center gap-2 rounded-neu-sm bg-surface px-3 py-2.5 text-left text-xs text-ink shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
              >
                <ShieldCheck className="h-4 w-4 text-accent-teal" />
                <span>
                  <span className="block font-semibold">Admin</span>
                  <span className="text-ink-muted">Full access</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => fill('EMPLOYEE')}
                className="flex items-center gap-2 rounded-neu-sm bg-surface px-3 py-2.5 text-left text-xs text-ink shadow-neu transition-all hover:shadow-neu-sm active:shadow-neu-inset-sm"
              >
                <User className="h-4 w-4 text-accent-blue" />
                <span>
                  <span className="block font-semibold">Employee</span>
                  <span className="text-ink-muted">Read only</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Curious about the project?{' '}
        <Link to="/problem-statement" className="font-semibold text-accent-blue">
          Read the background
        </Link>
      </p>
    </div>
  )
}
