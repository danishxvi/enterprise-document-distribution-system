import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FileText, FileWarning } from 'lucide-react'
import { api } from '../lib/api'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import { useAuth } from '../context/AuthContext'
import Container from '../components/layout/Container'
import PageHero from '../components/layout/PageHero'
import FilterBar from '../components/documents/FilterBar'
import DocumentCard from '../components/documents/DocumentCard'
import Pagination from '../components/documents/Pagination'
import PdfViewerModal from '../components/documents/PdfViewerModal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { cn } from '../lib/cn'

const EMPTY_FILTERS = { search: '', docType: '', branchId: '', startDate: '', endDate: '' }

// The reading room. Filters update instantly in the form, but the query only
// runs once typing pauses, and React Query caches every filter and page
// combination so paging back and forth never refetches.
export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)
  const [active, setActive] = useState(null)
  const query = useDebouncedValue(filters, 300)

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['documents', query, page],
    queryFn: () => api.listDocuments(query, page),
    placeholderData: keepPreviousData,
  })

  function handleFilterChange(next) {
    setFilters(next)
    setPage(0)
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS)
    setPage(0)
  }

  const documents = data?.content ?? []

  return (
    <div className="pb-20">
      <PageHero
        overlap
        eyebrow="Document library"
        title={`Welcome, ${user?.name?.split(' ')[0] ?? 'there'}`}
        lead="Every active circular, order and notification in one searchable place. Filter by type, branch or date, then open any document without leaving the page."
      />

      <Container className="relative -mt-16 space-y-10">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          resultCount={data?.totalElements}
        />

        {isLoading ? (
          <div className="grid place-items-center py-20 text-brand-500">
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
            action={<Button variant="secondary" onClick={handleReset}>Clear filters</Button>}
          />
        ) : (
          <div>
            <div
              className={cn(
                'grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
                isFetching && 'opacity-60'
              )}
            >
              {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} onView={setActive} />
              ))}
            </div>
            <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
          </div>
        )}
      </Container>

      <PdfViewerModal doc={active} open={Boolean(active)} onClose={() => setActive(null)} />
    </div>
  )
}
