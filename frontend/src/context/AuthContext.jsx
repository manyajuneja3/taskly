/**
 * src/context/AuthContext.jsx
 * ============================
 * React Context for authentication state.
 *
 * WHAT IS REACT CONTEXT?
 * Context solves "prop drilling" — passing data through many layers of components.
 * Instead of: App → Layout → Sidebar → UserAvatar (passing `user` as props each time)
 * We do:       Any component can call `useAuth()` and get the user directly.
 *
 * WHAT THIS CONTEXT PROVIDES:
 *   user        → the current User object { id, email, role } or null
 *   loading     → true while checking if user is logged in (on page load)
 *   login()     → call with tokens, stores them + fetches user profile
 *   logout()    → clears tokens + user state
 *   isAdmin     → boolean shortcut for user?.role === 'admin'
 *
 * (malicious JS can read localStorage). A more secure alternative is httpOnly
 * cookies (JS can't access them at all), but they require CSRF protection.
 * For an MVP/interview project, localStorage is the standard approach.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

// Step 1: Create the context object (starts as null)
const AuthContext = createContext(null)

// Step 2: Create the Provider component — wraps the whole app in App.jsx
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)  // true until we check for existing token

  // On app load: check if there's a saved access token and fetch the user profile.
  // This keeps the user logged in across page refreshes.
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      authAPI.me()
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token was invalid/expired — clear it
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  /**
   * Called after successful login.
   * Stores tokens in localStorage, then fetches + sets the user profile.
   */
  const login = async ({ access, refresh }) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    const res = await authAPI.me()
    setUser(res.data)
  }

  /**
   * Clears all auth state and tokens.
   * The Axios interceptor also calls this on 401 responses.
   */
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3: Custom hook — the clean way to consume context in any component
// Usage: const { user, login, logout, isAdmin } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
