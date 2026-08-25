import axios from 'axios'
import { PAGE_SIZE, USE_MOCK_API } from './constants'
import { MOCK_DOCUMENTS, MOCK_USERS } from './mockData'

// A single axios instance so every request shares the base url and the
// auth interceptor. The bearer token is attached from local storage on
// each call, which keeps the client stateless and refresh friendly.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('edds.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// Mock backend
// ---------------------------------------------------------------------------
// The mock store lives in local storage so uploads and deletes survive a
// reload. It behaves like the real service: filter, paginate, mutate.

const STORE_KEY = 'edds.documents'

function loadStore() {
  const raw = localStorage.getItem(STORE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fall through to reseed
    }
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(MOCK_DOCUMENTS))
  return [...MOCK_DOCUMENTS]
}

function saveStore(docs) {
  localStorage.setItem(STORE_KEY, JSON.stringify(docs))
}

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function applyFilters(docs, filters) {
  const { search, docType, branchId, startDate, endDate } = filters
  return docs.filter((doc) => {
    if (search && !doc.subject.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (docType && doc.docType !== docType) return false
    if (branchId && String(doc.branchId) !== String(branchId)) return false
    if (startDate && doc.issueDate < startDate) return false
    if (endDate && doc.issueDate > endDate) return false
    return doc.isActive
  })
}

const mockApi = {
  async login(email, password) {
    await delay()
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!user) {
      const error = new Error('Invalid email or password')
      error.status = 401
      throw error
    }
    // A fake but well formed token so the rest of the app can treat mock
    // and real modes identically.
    const token = btoa(`${user.email}:${user.role}:${Date.now()}`)
    const { password: _pw, ...safe } = user
    return { token, user: safe }
  },

  async listDocuments(filters = {}, page = 0) {
    await delay()
    const all = applyFilters(loadStore(), filters).sort((a, b) =>
      a.issueDate < b.issueDate ? 1 : -1
    )
    const start = page * PAGE_SIZE
    const content = all.slice(start, start + PAGE_SIZE)
    return {
      content,
      page,
      size: PAGE_SIZE,
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / PAGE_SIZE)),
    }
  },

  async createDocument(payload) {
    await delay(500)
    const docs = loadStore()
    const branchName = payload.branchName ?? ''
    const doc = {
      id: docs.reduce((max, d) => Math.max(max, d.id), 0) + 1,
      subject: payload.subject,
      docType: payload.docType,
      branchId: Number(payload.branchId),
      branchName,
      branchCode: payload.branchCode ?? '',
      issueDate: payload.issueDate,
      filePath: `upload/${Date.now()}-${payload.fileName}`,
      fileName: payload.fileName ?? 'document.pdf',
      isActive: true,
    }
    docs.unshift(doc)
    saveStore(docs)
    return doc
  },

  async deleteDocument(id) {
    await delay()
    const docs = loadStore().filter((d) => d.id !== id)
    saveStore(docs)
    return { success: true }
  },

  // In mock mode there is no real file to stream, so the viewer falls back
  // to a generated placeholder. The real client returns a protected url.
  viewUrl() {
    return null
  },
}

// ---------------------------------------------------------------------------
// Real backend
// ---------------------------------------------------------------------------

const realApi = {
  async login(email, password) {
    const { data } = await client.post('/auth/login', { email, password })
    return data
  },

  async listDocuments(filters = {}, page = 0) {
    const params = { page, size: PAGE_SIZE }
    if (filters.search) params.search = filters.search
    if (filters.docType) params.type = filters.docType
    if (filters.branchId) params.branch = filters.branchId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    const { data } = await client.get('/documents', { params })
    return data
  },

  async createDocument(payload) {
    const form = new FormData()
    form.append('subject', payload.subject)
    form.append('docType', payload.docType)
    form.append('branchId', payload.branchId)
    form.append('issueDate', payload.issueDate)
    form.append('file', payload.file)
    const { data } = await client.post('/documents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async deleteDocument(id) {
    const { data } = await client.delete(`/documents/${id}`)
    return data
  },

  viewUrl(id) {
    return `${client.defaults.baseURL}/documents/${id}/view`
  },
}

export const api = USE_MOCK_API ? mockApi : realApi
export { client }
