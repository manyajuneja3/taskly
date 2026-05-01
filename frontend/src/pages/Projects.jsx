import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectsAPI } from '../api/projects'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const AVATAR_COLORS = ['bg-teal-400','bg-orange-400','bg-blue-400','bg-purple-400','bg-pink-400']
const CARD_GRADIENTS = [
  'from-teal-400 to-teal-600',
  'from-orange-400 to-orange-500',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
]

export default function Projects() {
  const { isAdmin } = useAuth()
  const navigate    = useNavigate()

  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [formData, setFormData]     = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  const loadProjects = () => {
    setLoading(true)
    projectsAPI.list()
      .then((r) => setProjects(r.data))
      .catch(() => setError('Failed to load.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProjects() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await projectsAPI.create(formData)
      setFormData({ name: '', description: '' }); setShowForm(false); loadProjects()
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Failed.')
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    await projectsAPI.delete(id)
    setProjects((p) => p.filter((x) => x.id !== id))
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin ? 'Manage all team projects' : 'Your assigned projects'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            + New Project
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-6 border-l-4 border-teal-500">
          <h2 className="font-bold text-slate-800 mb-4">Create New Project</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input className="input" placeholder="Project name *" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
            <textarea className="input resize-none" rows={2} placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="bg-red-50 text-red-500 rounded-2xl px-4 py-3 text-sm mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">📁</div>
          <p className="font-bold text-slate-700 text-lg">No projects yet</p>
          {isAdmin && <p className="text-slate-400 text-sm mt-1">Click "New Project" to get started</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)}
              className="bg-white rounded-3xl overflow-hidden cursor-pointer
                         hover:shadow-lg hover:shadow-teal-100 hover:-translate-y-1
                         transition-all duration-200 group shadow-sm shadow-teal-50">

              {/* Colored top strip */}
              <div className={`bg-gradient-to-r ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}
                               px-6 py-5 flex items-center justify-between`}>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.name) }}
                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/40
                               flex items-center justify-center text-white text-lg transition-colors">
                    x
                  </button>
                )}
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-black text-slate-800 text-base mb-1 group-hover:text-teal-600 transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                )}

                {/* Progress */}
                <div className="mb-4">
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`bg-gradient-to-r ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} h-1.5 rounded-full`}
                      style={{ width: project.task_count > 0 ? '45%' : '0%' }}/>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {(project.members || []).slice(0, 4).map((m, mi) => (
                      <div key={m.id}
                        className={`w-7 h-7 rounded-full border-2 border-white flex items-center
                                    justify-center text-white text-xs font-bold
                                    ${AVATAR_COLORS[mi % AVATAR_COLORS.length]}`}
                        title={m.username}>
                        {m.username.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {!(project.members?.length) && (
                      <span className="text-xs text-slate-300">No members</span>
                    )}
                  </div>
                  <span className="bg-teal-50 text-teal-600 text-xs font-bold px-3 py-1 rounded-full">
                    {project.task_count} tasks
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
