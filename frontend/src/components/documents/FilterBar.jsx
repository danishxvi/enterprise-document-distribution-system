import { Search, SlidersHorizontal, X } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { BRANCHES, DOC_TYPES } from '../../lib/constants'

// The full width filter panel. Every control is a pressed input so the whole
// section reads as one sunken console. Changes flow straight up to the
// dashboard, which owns the filter state and refetches on change.
export default function FilterBar({ filters, onChange, onReset, resultCount }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  const hasActive =
    filters.search ||
    filters.docType ||
    filters.branchId ||
    filters.startDate ||
    filters.endDate

  return (
    <section className="rounded-neu bg-surface p-6 shadow-neu">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-accent-blue" />
          Filter documents
        </h2>
        {typeof resultCount === 'number' && (
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-muted shadow-neu-inset">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          type="search"
          placeholder="Search by subject..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="pl-11"
          aria-label="Search documents by subject"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Document type"
          value={filters.docType}
          onChange={(e) => set('docType', e.target.value)}
        >
          <option value="">All types</option>
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        <Select
          label="Branch"
          value={filters.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        >
          <option value="">All branches</option>
          {BRANCHES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>

        <Input
          type="date"
          label="From date"
          value={filters.startDate}
          onChange={(e) => set('startDate', e.target.value)}
        />
        <Input
          type="date"
          label="To date"
          value={filters.endDate}
          onChange={(e) => set('endDate', e.target.value)}
        />
      </div>

      {hasActive && (
        <div className="mt-5 flex justify-end">
          <Button size="sm" onClick={onReset}>
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </div>
      )}
    </section>
  )
}
