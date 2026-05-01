/**
 * src/components/ProtectedRoute.jsx
 * ===================================
 * A wrapper component that guards pages requiring authentication.
 *
 * If the user is NOT logged in → redirect to /login.
 * If the user IS logged in → render the page normally.
 *
 * Used in App.jsx to wrap all private routes:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 *
 * If unauthenticated, it uses React Router's <Navigate> to redirect.
 * The `loading` check prevents a flash redirect while we verify the token.
 *
 * Optional `adminOnly` prop restricts certain pages to Admin users.
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  // While we're checking localStorage for an existing token, show a spinner.
  // Without this, logged-in users would briefly see the login page on refresh.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Page is admin-only but user is a member → go to dashboard
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
