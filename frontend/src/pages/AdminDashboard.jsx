import { useRef, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, FileWarning, Layers, Network, Trash2, Upload, UploadCloud } from 'lucide-react'
import { api, errorMessage } from '../lib/api'
import { BRANCHES, DOC_TYPES, MAX_FILE_MB } from '../lib/constants'
import Container from '../components/layout/Container'
import PageHero from '../components/layout/PageHero'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Notice from '../components/ui/Notice'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import DocumentCard from '../components/documents/DocumentCard'
import Pagination from '../components/documents/Pagination'
import PdfViewerModal from '../components/documents/PdfViewerModal'
import { cn } from '../lib/cn'

function emptyForm() {
  return {
    subject: '',
    docType: 'CIRCULAR',
    branchId: BRANCHES[0].id,
    issueDate: new Date().toISOString().slice(0, 10),
  }
}

// The admin console: publish new documents through a validated form, and
// review or retire existing ones. The list and the form share the query
// cache, so a successful upload or delete refreshes everything.
export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const fileRef = useRef(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [page, setPage] = useState(0)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [viewing, setViewing] = useState(null)

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['documents', 'admin', page],
    queryFn: () => api.listDocuments({}, page),
    placeholderData: keepPreviousData,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => api.createDocument(payload),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setNotice(`Published "${doc.subject}".`)
      setForm(emptyForm())
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setPage(0)
      setTimeout(() => setNotice(null), 4000)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setPendingDelete(null)
    },
  })

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  // Quick client side checks for instant feedback. The server repeats them
  // and also inspects the real file bytes with Apache Tika.
  function handleFile(selected) {
    setFileError(null)
    if (!selected) {
      setFile(null)
      return
    }
    const isPdf = selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setFileError('Only PDF files are accepted.')
      setFile(null)
      return
    }
    if (selected.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File exceeds the ${MAX_FILE_MB} MB limit.`)
      setFile(null)
      return
    }
    setFile(selected)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setFileError('Please attach a PDF file.')
      return
    }
    const branch = BRANCHES.find((b) => String(b.id) === String(form.branchId))
    createMutation.mutate({
      ...form,
      file,
      fileName: file.name,
      branchName: branch?.name,
      branchCode: branch?.code,
    })
  }

  function closeDelete() {
    setPendingDelete(null)
    deleteMutation.reset()
  }

  const documents = data?.content ?? []
  const stats = [
    { icon: Layers, label: 'Active documents', value: data?.totalElements ?? 0 },
    { icon: FileText, label: 'Document types', value: DOC_TYPES.length },
    { icon: Network, label: 'Branches', value: BRANCHES.length },
  ]

  return (
    <div className="pb-20">
      <PageHero
        overlap
        eyebrow="Admin console"
        title="Manage documents"
        lead="Publish new circulars, orders and notifications, and retire the ones that are no longer current. Uploads are checked for type and size before they reach storage."
      />

      <Container className="relative -mt-16 space-y-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <Card key={label} className="flex items-center gap-4 shadow-card">
              <span className="icon-tile h-12 w-12 bg-brand-500 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-brand-900">{value}</p>
                <p className="text-sm text-brand-900/65">{label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Upload form */}
          <div className="lg:col-span-2">
            <Card className="lg:sticky lg:top-24">
              <h2 className="flex items-center gap-2 text-base font-bold text-brand-900">
                <Upload className="h-4 w-4 text-brand-500" />
                Publish a document
              </h2>

              {notice && <Notice tone="success" className="mt-4">{notice}</Notice>}
              {createMutation.isError && (
                <Notice tone="error" className="mt-4">
                  {errorMessage(createMutation.error, 'The document could not be published.')}
                </Notice>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Input
                  id="subject"
                  label="Subject"
                  placeholder="Short, descriptive title"
                  value={form.subject}
                  onChange={(e) => set('subject', e.target.value)}
                  maxLength={500}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select id="docType" label="Type" value={form.docType} onChange={(e) => set('docType', e.target.value)}>
                    {DOC_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    id="issueDate"
                    type="date"
                    label="Issue date"
                    value={form.issueDate}
                    onChange={(e) => set('issueDate', e.target.value)}
                    required
                  />
                </div>
                <Select id="branchId" label="Branch" value={form.branchId} onChange={(e) => set('branchId', e.target.value)}>
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>

                <div>
                  <span className="field-label">PDF file</span>
                  <label
                    htmlFor="file"
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition',
                      file ? 'border-brand-500 bg-brand-50' : 'border-brand-200 hover:border-brand-500 hover:bg-brand-50'
                    )}
                  >
                    <UploadCloud className="h-7 w-7 text-brand-500" />
                    <span className="max-w-full truncate text-sm font-semibold text-brand-900">
                      {file ? file.name : 'Click to attach a PDF'}
                    </span>
                    <span className="text-xs text-brand-900/60">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `PDF only, up to ${MAX_FILE_MB} MB`}
                    </span>
                    <input
                      ref={fileRef}
                      id="file"
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                  </label>
                  {fileError && <Notice tone="error" className="mt-3">{fileError}</Notice>}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Spinner className="h-5 w-5" /> : <Upload className="h-4 w-4" />}
                  {createMutation.isPending ? 'Publishing' : 'Publish document'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Existing documents */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-base font-bold text-brand-900">Published documents</h2>
            {isLoading ? (
              <div className="grid place-items-center py-20 text-brand-500">
                <Spinner className="h-8 w-8" />
              </div>
            ) : isError ? (
              <EmptyState
                icon={FileWarning}
                title="Could not load documents"
                message="Something went wrong while fetching the list."
                action={<Button onClick={() => refetch()}>Try again</Button>}
              />
            ) : documents.length === 0 ? (
              <EmptyState title="No documents yet" message="Publish your first document using the form." />
            ) : (
              <>
                <div className={cn('grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2', isFetching && 'opacity-60')}>
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} canDelete onView={setViewing} onDelete={setPendingDelete} />
                  ))}
                </div>
                <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </Container>

      <PdfViewerModal doc={viewing} open={Boolean(viewing)} onClose={() => setViewing(null)} />

      <Modal open={Boolean(pendingDelete)} onClose={closeDelete} title="Retire this document?" className="max-w-md">
        <p className="text-sm text-brand-900/75">
          <span className="font-semibold text-brand-900">{pendingDelete?.subject}</span> will be removed
          from the library for every reader. The record is kept for audit.
        </p>
        {deleteMutation.isError && (
          <Notice tone="error" className="mt-4">
            {errorMessage(deleteMutation.error, 'The document could not be retired.')}
          </Notice>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={closeDelete}>
            Cancel
          </Button>
          <Button onClick={() => deleteMutation.mutate(pendingDelete.id)} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <Spinner className="h-5 w-5" /> : <Trash2 className="h-4 w-4" />}
            Retire
          </Button>
        </div>
      </Modal>
    </div>
  )
}
