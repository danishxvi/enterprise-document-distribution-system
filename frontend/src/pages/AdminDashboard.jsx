import { useMemo, useRef, useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  CheckCircle2,
  FileText,
  FileWarning,
  Layers,
  Trash2,
  Upload,
  UploadCloud,
} from 'lucide-react'
import { api } from '../lib/api'
import { BRANCHES, DOC_TYPES } from '../lib/constants'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import DocumentCard from '../components/documents/DocumentCard'

const MAX_FILE_MB = 10
const EMPTY_FORM = {
  subject: '',
  docType: 'CIRCULAR',
  branchId: BRANCHES[0].id,
  issueDate: new Date().toISOString().slice(0, 10),
}

// The admin console. Two responsibilities: publish new documents through a
// validated upload form, and retire existing ones. The list and the form
// share a query cache, so a successful upload or delete refreshes the grid.
export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const fileRef = useRef(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [page, setPage] = useState(0)
  const [pendingDelete, setPendingDelete] = useState(null)

  const listKey = useMemo(() => ['documents', 'admin', page], [page])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: listKey,
    queryFn: () => api.listDocuments({}, page),
    placeholderData: keepPreviousData,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => api.createDocument(payload),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setNotice(`Published "${doc.subject}".`)
      setForm(EMPTY_FORM)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
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

  // Client side gate. The Spring Boot controller does the authoritative
  // check with Apache Tika, but catching obvious problems here saves a round
  // trip and gives instant feedback.
  function handleFile(selected) {
    setFileError(null)
    if (!selected) {
      setFile(null)
      return
    }
    const isPdf =
      selected.type === 'application/pdf' ||
      selected.name.toLowerCase().endsWith('.pdf')
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

  const documents = data?.content ?? []
  const total = data?.totalElements ?? 0

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <p className="text-sm font-semibold text-accent-teal">Admin console</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
          Manage documents
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Publish new circulars, orders and notifications, and retire ones that
          are no longer current. Uploads are validated for type and size before
          they reach storage.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatTile icon={Layers} label="Total documents" value={total} tint="#3182CE" />
        <StatTile
          icon={FileText}
          label="Document types"
          value={DOC_TYPES.length}
          tint="#38B2AC"
        />
        <StatTile
          icon={UploadCloud}
          label="Branches"
          value={BRANCHES.length}
          tint="#DD6B20"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Upload form */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Upload className="h-4 w-4 text-accent-blue" />
              Publish a document
            </h2>

            {notice && (
              <div className="mt-4 flex items-center gap-2 rounded-neu-sm bg-surface px-4 py-3 text-sm text-accent-teal shadow-neu-inset">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <Input
                id="subject"
                label="Subject"
                placeholder="Short, descriptive title"
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Type"
                  value={form.docType}
                  onChange={(e) => set('docType', e.target.value)}
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
                <Input
                  type="date"
                  label="Issue date"
                  value={form.issueDate}
                  onChange={(e) => set('issueDate', e.target.value)}
                  required
                />
              </div>
              <Select
                label="Branch"
                value={form.branchId}
                onChange={(e) => set('branchId', e.target.value)}
              >
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>

              <div>
                <span className="mb-2 block text-sm font-medium text-ink-muted">
                  PDF file (max {MAX_FILE_MB} MB)
                </span>
                <label
                  htmlFor="file"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-neu-sm bg-surface px-4 py-8 text-center shadow-neu-inset transition-shadow"
                >
                  <UploadCloud className="h-7 w-7 text-ink-muted" />
                  <span className="text-sm font-medium text-ink">
                    {file ? file.name : 'Click to attach a PDF'}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : 'PDF only, up to 10 MB'}
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
                {fileError && (
                  <p className="mt-2 text-xs font-medium text-red-500">{fileError}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Spinner className="h-5 w-5" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {createMutation.isPending ? 'Publishing' : 'Publish document'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Existing documents */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-base font-bold text-ink">Published documents</h2>
          {isLoading ? (
            <div className="grid place-items-center py-20">
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
            <EmptyState
              title="No documents yet"
              message="Publish your first document using the form on the left."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  canDelete
                  onView={() => {}}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Retire this document?"
        className="max-w-md"
      >
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">{pendingDelete?.subject}</span>{' '}
          will be removed from the library. This cannot be undone from here.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(pendingDelete.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Spinner className="h-5 w-5" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="flex items-center gap-4">
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-neu-sm bg-surface shadow-neu-inset"
        style={{ color: tint }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-ink">{value}</p>
        <p className="text-xs font-medium text-ink-muted">{label}</p>
      </div>
    </Card>
  )
}
