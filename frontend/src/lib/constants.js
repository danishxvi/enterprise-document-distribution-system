// Shared enumerations that mirror the backend model. Keeping them in one
// place means a dropdown, a badge and an API filter never drift apart.

export const DOC_TYPES = [
  { value: 'CIRCULAR', label: 'Circular' },
  { value: 'ORDER', label: 'Order' },
  { value: 'NOTIFICATION', label: 'Notification' },
]

// Each type gets its own quiet accent so the grid is scannable at a glance.
export const DOC_TYPE_STYLES = {
  CIRCULAR: { label: 'Circular', text: '#2C5282', dot: '#3182CE' },
  ORDER: { label: 'Order', text: '#285E61', dot: '#38B2AC' },
  NOTIFICATION: { label: 'Notification', text: '#9C4221', dot: '#DD6B20' },
}

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

// When no backend is reachable the app runs entirely on seeded mock data.
// Flip this off through the env file once the Spring Boot service is up.
export const USE_MOCK_API =
  (import.meta.env.VITE_USE_MOCK ?? 'true').toString() === 'true'
