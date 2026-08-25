import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Any signed in user may pass. Unauthenticated visitors are bounced to the
// login page, and the attempted path is remembered so they land back here.
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

// Admin only. Signed in employees are sent to their dashboard rather than
// the login page, since re authenticating would not help them.
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
