// Shared enumerations that mirror the backend model. Keeping them in one
// place means a dropdown, a badge and an API filter never drift apart.

export const DOC_TYPES = [
  { value: 'CIRCULAR', label: 'Circular' },
  { value: 'ORDER', label: 'Order' },
  { value: 'NOTIFICATION', label: 'Notification' },
]

// The palette is blue and white only, so document types are told apart by
// fill style rather than by hue: solid, tinted and outlined.
export const DOC_TYPE_STYLES = {
  CIRCULAR: { label: 'Circular', className: 'bg-brand-500 text-white border-brand-500' },
  ORDER: { label: 'Order', className: 'bg-brand-100 text-brand-700 border-brand-100' },
  NOTIFICATION: { label: 'Notification', className: 'bg-white text-brand-500 border-brand-500' },
}

// Mirrors the branches the backend seeds on first start, in the same order,
// so the ids line up with the database.
export const BRANCHES = [
  { id: 1, name: 'Operations', code: 'OPS' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Engineering', code: 'ENG' },
  { id: 4, name: 'Finance', code: 'FIN' },
  { id: 5, name: 'Rolling Stock', code: 'RS' },
  { id: 6, name: 'Signalling and Telecom', code: 'SNT' },
]

export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
}

export const PAGE_SIZE = 9

export const MAX_FILE_MB = 10

// When no backend is reachable the app runs entirely on seeded mock data.
// Flip this off through the env file once the Spring Boot service is up.
export const USE_MOCK_API =
  (import.meta.env.VITE_USE_MOCK ?? 'true').toString() === 'true'
