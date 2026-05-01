/**
 * src/App.jsx
 * ===========
 * The root component — wires up React Router and the Auth context.
 *
 * Route structure:
 *   /              → redirect to /dashboard
 *   /login         → Login page (public)
 *   /dashboard     → Dashboard (protected)
 *   /projects      → Projects list (protected)
 *   /projects/:id  → Task Board for a project (protected)
 *   *              → 404
 *
 * without a full page reload. <BrowserRouter> listens to the history API.
 * <Routes> + <Route> define the mapping. <Link> and useNavigate()
 * change the URL programmatically.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects  from './pages/Projects'
import TaskBoard from './pages/TaskBoard'

export default function App() {
  return (
    // AuthProvider wraps everything so any component can access auth state
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <TaskBoard />
              </ProtectedRoute>
            }
          />

          {/* Default: redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-6xl font-bold">404</p>
                  <p className="mt-2">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
