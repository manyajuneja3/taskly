/**
 * src/api/tasks.js
 * =================
 * All task-related API calls.
 */

import api from './axios'

export const tasksAPI = {
  /** GET /api/tasks/?project=<id> — list tasks, optionally filter by project */
  list: (params = {}) => api.get('/api/tasks/', { params }),

  /** GET /api/tasks/:id/ */
  get: (id) => api.get(`/api/tasks/${id}/`),

  /** POST /api/tasks/ — create task (Admin only) */
  create: (data) => api.post('/api/tasks/', data),

  /** PATCH /api/tasks/:id/ — update task (Admin: full, Member: status only) */
  update: (id, data) => api.patch(`/api/tasks/${id}/`, data),

  /** DELETE /api/tasks/:id/ — Admin only */
  delete: (id) => api.delete(`/api/tasks/${id}/`),

  /** GET /api/tasks/dashboard/ — summary stats for dashboard */
  dashboard: () => api.get('/api/tasks/dashboard/'),
}
