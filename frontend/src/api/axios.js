/**
 * src/api/axios.js
 * ================
 * A pre-configured Axios instance — the single place where ALL API calls originate.
 *
 * Why a custom instance instead of plain `axios`?
 *   1. We set baseURL once — no repeating it in every API call.
 *   2. We attach the JWT token automatically to every request (interceptor).
 *   3. We handle 401 Unauthorized globally — auto-logout when token expires.
 *
 * access token from localStorage and attach it as the Authorization header.
 * If a response comes back 401, the response interceptor catches it and
 * logs the user out (clears tokens + redirects to login).
 */

import axios from 'axios'

// In development: Vite proxy forwards /api → localhost:8000
// In production:  VITE_API_URL env var points to Railway backend URL
const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ────────────────────────────────────────────────────
// Runs BEFORE every request is sent.
// Reads the JWT access token from localStorage and injects it into headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Django simplejwt expects: "Authorization: Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ───────────────────────────────────────────────────
// Runs AFTER every response is received.
// If the server returns 401 (Unauthorized), our token expired → log out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored tokens
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      // Redirect to login page
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
