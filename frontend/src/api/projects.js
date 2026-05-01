/**
 * src/api/projects.js
 * ====================
 * All project-related API calls.
 */

import api from './axios'

export const projectsAPI = {
  /** GET /api/projects/ — list all accessible projects */
  list: () => api.get('/api/projects/'),

  /** GET /api/projects/:id/ — single project detail */
  get: (id) => api.get(`/api/projects/${id}/`),

  /** POST /api/projects/ — create project (Admin only) */
  create: (data) => api.post('/api/projects/', data),

  /** PATCH /api/projects/:id/ — partial update (Admin only) */
  update: (id, data) => api.patch(`/api/projects/${id}/`, data),

  /** DELETE /api/projects/:id/ — delete (Admin only) */
  delete: (id) => api.delete(`/api/projects/${id}/`),

  /** POST /api/projects/:id/add_member/ */
  addMember: (id, userId) =>
    api.post(`/api/projects/${id}/add_member/`, { user_id: userId }),

  /** POST /api/projects/:id/remove_member/ */
  removeMember: (id, userId) =>
    api.post(`/api/projects/${id}/remove_member/`, { user_id: userId }),
}
