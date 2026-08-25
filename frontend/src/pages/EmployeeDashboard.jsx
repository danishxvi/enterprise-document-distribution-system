import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FileText, FileWarning } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import FilterBar from '../components/documents/FilterBar'
import DocumentCard from '../components/documents/DocumentCard'
import Pagination from '../components/documents/Pagination'
import PdfViewerModal from '../components/documents/PdfViewerModal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

const EMPTY_FILTERS = {
  search: '',
  docType: '',
  branchId: '',
  startDate: '',
  endDate: '',
}

// The reading room. Employees filter the shared library and open documents
// in place. React Query caches each filter and page combination so paging
// back and forth is instant and repeat views never refetch.
export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)
  const [active, setActive] = useState(null)

  // A stable key so React Query can memoise per filter set and page.
  const queryKey = useMemo(() => ['documents', filters, page], [filters, page])

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () => api.listDocuments(filters, page),
    placeholderData: keepPreviousData,
  })

  function handleFilterChange(next) {
    setFilters(next)
    setPage(0) // any filter change resets to the first page
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS)
    setPage(0)
  }

  const documents = data?.content ?? []

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <p className="text-sm font-semibold text-accent-blue">Document library</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
          Welcome, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Every active circular, order and notification in one searchable place.
          Filter by type, branch or date, then open any document without leaving
          the page.
        </p>
      </header>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        resultCount={data?.totalElements}
      />

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={FileWarning}
          title="Could not load documents"
          message="Something went wrong while fetching the library."
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No matching documents"
          message="No documents match the current filters. Widen your search to see more."
          action={<Button onClick={handleReset}>Clear filters</Button>}
        />
      ) : (
        <>
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onView={setActive} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onChange={setPage}
          />
        </>
      )}

      <PdfViewerModal
        doc={active}
        open={Boolean(active)}
        onClose={() => setActive(null)}
      />
    </div>
  )
}
