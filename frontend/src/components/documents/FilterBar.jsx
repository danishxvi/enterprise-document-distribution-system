import { Search, SlidersHorizontal, X } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { BRANCHES, DOC_TYPES } from '../../lib/constants'

// The filter panel. It is a controlled form: the dashboard owns the state and
// decides when to query, so this component only reports changes.
export default function FilterBar({ filters, onChange, onReset, resultCount }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  const hasActive = Object.values(filters).some(Boolean)

  return (
    <section className="rounded-2xl border border-brand-200 bg-white p-6 shadow-card" aria-label="Filters">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-brand-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-500" />
          Filter documents
        </h2>
        <div className="flex items-center gap-3">
          {typeof resultCount === 'number' && (
            <span className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </span>
          )}
          {hasActive && (
            <Button size="sm" variant="ghost" onClick={onReset}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
        <Input
          type="search"
          placeholder="Search by subject"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="pl-11"
          aria-label="Search documents by subject"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select id="filter-type" label="Document type" value={filters.docType} onChange={(e) => set('docType', e.target.value)}>
          <option value="">All types</option>
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        <Select id="filter-branch" label="Branch" value={filters.branchId} onChange={(e) => set('branchId', e.target.value)}>
          <option value="">All branches</option>
          {BRANCHES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>

        <Input
          id="filter-from"
          type="date"
          label="From date"
          value={filters.startDate}
          max={filters.endDate || undefined}
          onChange={(e) => set('startDate', e.target.value)}
        />
        <Input
          id="filter-to"
          type="date"
          label="To date"
          value={filters.endDate}
          min={filters.startDate || undefined}
          onChange={(e) => set('endDate', e.target.value)}
        />
      </div>
    </section>
  )
}
