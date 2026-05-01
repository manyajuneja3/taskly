import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * vite.config.js
 * ==============
 * Vite is our build tool + dev server.
 * 
 * Key config here: the `proxy` setting.
 * 
 * During development, React runs on :5173 and Django on :8000.
 * If React calls /api/... directly, the browser blocks it (CORS).
 * The proxy intercepts /api/ requests and forwards them to :8000,
 * making them appear same-origin to the browser.
 * 
 * In production, we deploy them separately — Django on Railway,
 * React's build served statically (or via a separate Railway service).
 * The VITE_API_URL env var points to the live Django URL.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api goes to Django dev server
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
