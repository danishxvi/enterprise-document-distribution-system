import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, LogIn, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Notice from '../components/ui/Notice'
import Logo from '../components/layout/Logo'
import { errorMessage } from '../lib/api'
import { USE_MOCK_API } from '../lib/constants'

const POINTS = [
  'Every circular, order and notification in one library',
  'Search by subject, type, branch and date',
  'Role based access with documents streamed securely',
]

const DEMO_ACCOUNTS = [
  { role: 'ADMIN', icon: ShieldCheck, label: 'Admin', note: 'Publish and retire', email: 'admin@edds.local', password: 'admin123' },
  { role: 'EMPLOYEE', icon: User, label: 'Employee', note: 'Read only access', email: 'employee@edds.local', password: 'employee123' },
]

// Split screen sign in: brand panel on the left, form on the right. On
// success it honours a remembered return path, otherwise it routes by role.
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
      navigate(from ?? (profile.role === 'ADMIN' ? '/admin' : '/dashboard'), { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Sign in failed. Please try again.'))
    }
  }

  function fill(account) {
    setEmail(account.email)
    setPassword(account.password)
    setError(null)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-brand-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-3xl bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-16 right-40 h-24 w-24 rounded-2xl border-2 border-white/25" />
        <Logo inverse />
        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight">Official documents, finally in one place.</h1>
          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-white/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/70">Enterprise Document Distribution System</p>
      </aside>

      {/* Form */}
      <main className="flex flex-col justify-center px-4 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Logo />
          </div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <h2 className="mt-6 text-3xl font-extrabold text-brand-900">Sign in</h2>
          <p className="mt-2 text-sm text-brand-900/70">Use your work account to open the document library.</p>

          {error && <Notice tone="error" className="mt-6">{error}</Notice>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Spinner className="h-5 w-5" /> : <LogIn className="h-4 w-4" />}
              {loading ? 'Signing in' : 'Sign in'}
            </Button>
          </form>

          {USE_MOCK_API && (
            <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">Demo accounts</p>
              <p className="mt-1 text-xs text-brand-900/70">Pick one to fill the form, then sign in.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.map((account) => {
                  const Icon = account.icon
                  return (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => fill(account)}
                      className="flex items-center gap-3 rounded-xl border border-brand-200 bg-white px-3 py-3 text-left transition hover:border-brand-500"
                    >
                      <span className="icon-tile h-9 w-9">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-brand-900">{account.label}</span>
                        <span className="block text-xs text-brand-900/60">{account.note}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
