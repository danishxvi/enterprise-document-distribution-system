import { Link } from 'react-router-dom'

// A calm closing band. It restates the project name, links the narrative
// pages and carries a neutral copyright line with no personal attribution.
export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-20">
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-neu bg-surface p-8 shadow-neu">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <h3 className="text-sm font-extrabold text-ink">
                Enterprise Document Distribution System
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                A secure, searchable home for internal circulars, orders and
                notifications. Built to replace scattered email threads with a
                single source of truth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Project
                </span>
                <Link to="/problem-statement" className="text-ink hover:text-accent-blue">
                  Problem statement
                </Link>
                <Link to="/proposed-solution" className="text-ink hover:text-accent-blue">
                  Proposed solution
                </Link>
                <Link to="/about-developer" className="text-ink hover:text-accent-blue">
                  About the developer
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Access
                </span>
                <Link to="/dashboard" className="text-ink hover:text-accent-blue">
                  Documents
                </Link>
                <Link to="/login" className="text-ink hover:text-accent-blue">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-300/40 pt-6 text-xs text-ink-muted">
            Copyright {year} Danish Husain. Built for internal enterprise
            communication.
          </div>
        </div>
      </div>
    </footer>
  )
}
