import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api'

// Auth state is intentionally thin: a user object and a token. Both are
// mirrored into local storage so a refresh keeps the session, and the api
// layer reads the token straight from storage on every request.

const AuthContext = createContext(null)

function readStoredUser() {
  const raw = localStorage.getItem('edds.user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { token, user: profile } = await api.login(email, password)
      localStorage.setItem('edds.token', token)
      localStorage.setItem('edds.user', JSON.stringify(profile))
      setUser(profile)
      return profile
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('edds.token')
    localStorage.removeItem('edds.user')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
    }),
    [user, loading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
