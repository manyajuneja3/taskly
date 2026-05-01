/**
 * src/api/auth.js
 * ===============
 * All auth-related API calls in one place.
 * This is the "service layer" pattern — UI components don't need to
 * know the exact URLs, just call these functions.
 */

import api from './axios'

export const authAPI = {
  /**
   * Register a new user.
   * POST /api/auth/register/
   * Body: { username, email, password, role }
   */
  register: (data) => api.post('/api/auth/register/', data),

  /**
   * Login with email + password.
   * POST /api/auth/login/
   * Returns: { access, refresh }
   */
  login: (email, password) =>
    api.post('/api/auth/login/', { email, password }),

  /**
   * Refresh the access token using the refresh token.
   * POST /api/auth/refresh/
   */
  refresh: (refreshToken) =>
    api.post('/api/auth/refresh/', { refresh: refreshToken }),

  /**
   * Get the current logged-in user's profile.
   * GET /api/auth/me/
   * Requires: valid access token (set by interceptor)
   */
  me: () => api.get('/api/auth/me/'),

  /** List all registered users — used by admin to add project members */
  listUsers: () => api.get('/api/auth/users/'),
}
