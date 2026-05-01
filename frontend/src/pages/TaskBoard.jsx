import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tasksAPI } from '../api/tasks'
import { projectsAPI } from '../api/projects'
import { authAPI } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       dot: 'bg-blue-400',   bg: 'bg-blue-50',   count_bg: 'bg-blue-100 text-blue-600'    },
  { key: 'in_progress', label: 'In Progress', dot: 'bg-orange-400', bg: 'bg-orange-50', count_bg: 'bg-orange-100 text-orange-600' },
  { key: 'done',        label: 'Completed',   dot: 'bg-teal-500',   bg: 'bg-teal-50',   count_bg: 'bg-teal-100 text-teal-700'    },
]
const AVATAR_COLORS = ['bg-teal-400','bg-orange-400','bg-blue-400','bg-purple-400','bg-pink-400']

function TaskCard({ task, isAdmin, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const handleStatus = async (s) => {
    setUpdating(true)
    try { await tasksAPI.update(task.id, { status: s }); onStatusChange() }
    finally { setUpdating(false) }
  }
  const initials  = task.assigned_to?.username?.slice(0,2).toUpperCase() || '?'
  const colorIdx  = task.assigned_to?.id ? task.assigned_to.id % AVATAR_COLORS.length : 0

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm shadow-teal-50 group
      ${task.is_overdue ? 'border-l-4 border-red-400' : ''}`}>

      {task.is_overdue && (
        <span className="text-xs font-bold text-red-400 uppercase tracking-wide block mb-2">Overdue</span>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-sm font-semibold leading-snug flex-1
          ${task.status === 'done' ? 'line-through text-slate-300' : 'text-slate-800'}`}>
          {task.title}
        </p>
        {isAdmin && (
          <button onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-slate-100
                       hover:bg-red-100 hover:text-red-400 flex items-center justify-center
                       text-slate-300 text-sm transition-all flex-shrink-0">x</button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {task.deadline && (
        <div className={`flex items-center gap-1 mb-3 text-xs px-2.5 py-1 rounded-xl w-fit font-semibold
          ${task.is_overdue ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'}`}>
          {new Date(task.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
          {task.is_overdue && ' - Late'}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
        {task.assigned_to ? (
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${AVATAR_COLORS[colorIdx]} flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <span className="text-xs text-slate-400">{task.assigned_to.username}</span>
          </div>
        ) : <span className="text-xs text-slate-300">Unassigned</span>}

        <select value={task.status} disabled={updating} onChange={(e) => handleStatus(e.target.value)}
          className="text-xs bg-teal-50 border-0 rounded-xl px-2 py-1 font-semibold text-teal-700
                     focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50 cursor-pointer">
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  )
}

export default function TaskBoard() {
  const { projectId } = useParams()
  const { isAdmin }   = useAuth()

  const [project, setProject]       = useState(null)
  const [tasks, setTasks]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [allUsers, setAllUsers]     = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [memberMsg, setMemberMsg]   = useState('')
  const [error, setError]           = useState('')
  const [newTask, setNewTask] = useState({
    title:'', description:'', assigned_to_id:null, status:'todo', deadline:''
  })

  const loadData = () => {
    setLoading(true)
    Promise.all([projectsAPI.get(projectId), tasksAPI.list({ project: projectId })])
      .then(([p, t]) => { setProject(p.data); setTasks(t.data) })
      .catch(() => setError('Failed to load.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [projectId])

  // Load all users when Members panel opens
  useEffect(() => {
    if (showMembers && allUsers.length === 0) {
      authAPI.listUsers().then((r) => setAllUsers(r.data))
    }
  }, [showMembers])

  const handleAddMember = async () => {
    if (!selectedUser) return
    setMemberMsg('')
    try {
      await projectsAPI.addMember(projectId, selectedUser)
      setSelectedUser('')
      setMemberMsg('Member added!')
      loadData()
      setTimeout(() => setMemberMsg(''), 2000)
    } catch (err) {
      setMemberMsg(err.response?.data?.detail || 'Could not add member.')
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return
    try {
      await projectsAPI.removeMember(projectId, userId)
      setMemberMsg('Member removed.')
      loadData()
      setTimeout(() => setMemberMsg(''), 2000)
    } catch {
      setMemberMsg('Could not remove member.')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await tasksAPI.create({
        ...newTask, project: projectId,
        deadline: newTask.deadline || null,
        assigned_to_id: newTask.assigned_to_id || null,
      })
      setNewTask({ title:'', description:'', assigned_to_id:null, status:'todo', deadline:'' })
      setShowForm(false); loadData()
    } catch (err) {
      const d = err.response?.data
      if (d) setError(Object.values(d).flat().join(' '))
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    await tasksAPI.delete(taskId); loadData()
  }

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </Layout>
  )

  const done  = tasks.filter((t) => t.status === 'done').length
  const total = tasks.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  // Users not already in the project
  const memberIds = new Set((project?.members || []).map((m) => m.id))
  const nonMembers = allUsers.filter((u) => !memberIds.has(u.id))

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/projects" className="text-slate-400 hover:text-teal-600 font-medium">Projects</Link>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-800">{project?.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">{project?.name}</h1>
          {project?.description && <p className="text-slate-400 text-sm mt-1">{project.description}</p>}

          <div className="flex items-center gap-4 mt-3">
            <div className="flex -space-x-2">
              {project?.members?.slice(0,5).map((m,i) => (
                <div key={m.id}
                  className={`w-8 h-8 rounded-full border-2 border-[#E6F7F7] ${AVATAR_COLORS[i%AVATAR_COLORS.length]}
                              flex items-center justify-center`} title={m.username}>
                  <span className="text-white text-xs font-bold">{m.username.charAt(0).toUpperCase()}</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium">{project?.members?.length||0} members</span>
            <span className="text-xs bg-teal-100 text-teal-700 font-bold px-3 py-1 rounded-full">
              {pct}% complete
            </span>
          </div>

          <div className="w-64 bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}/>
          </div>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <button onClick={() => setShowMembers((v) => !v)}
              className="btn-secondary flex items-center gap-2">
              <span>👥</span> Manage Members
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setShowForm((v) => !v)} className="btn-primary">+ Add Task</button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-500 rounded-2xl px-4 py-3 text-sm mb-4">{error}</div>}

      {/* ── Manage Members Panel ── */}
      {showMembers && isAdmin && (
        <div className="card mb-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Manage Members</h2>
            <button onClick={() => { setShowMembers(false); setMemberMsg('') }}
              className="text-slate-300 hover:text-slate-500 text-xl leading-none">x</button>
          </div>

          {/* Add member row */}
          <div className="flex gap-2 mb-5">
            <select className="input flex-1" value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">-- Select a user to add --</option>
              {nonMembers.map((u) => (
                <option key={u.id} value={u.id}>{u.username} ({u.email}) — {u.role}</option>
              ))}
            </select>
            <button onClick={handleAddMember} disabled={!selectedUser}
              className="btn-primary disabled:opacity-40 whitespace-nowrap">
              + Add
            </button>
          </div>

          {memberMsg && (
            <p className={`text-sm font-semibold mb-3 px-3 py-2 rounded-xl
              ${memberMsg.includes('!') ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-500'}`}>
              {memberMsg}
            </p>
          )}

          {/* Current members list */}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Members</p>
          {project?.members?.length === 0 ? (
            <p className="text-sm text-slate-300 py-2">No members yet. Add someone above.</p>
          ) : (
            <ul className="space-y-2">
              {project.members.map((m, i) => (
                <li key={m.id}
                  className="flex items-center gap-3 bg-[#F0FAFA] rounded-2xl px-4 py-3">
                  <div className={`w-9 h-9 rounded-2xl ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                                  flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">
                      {m.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{m.username}</p>
                    <p className="text-xs text-slate-400">{m.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                    ${m.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                    {m.role}
                  </span>
                  <button onClick={() => handleRemoveMember(m.id)}
                    className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 text-red-400
                               flex items-center justify-center text-sm transition-colors flex-shrink-0">
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Create task form */}
      {showForm && isAdmin && (
        <div className="card mb-6 border-l-4 border-teal-500">
          <h2 className="font-bold text-slate-800 mb-4">New Task</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input md:col-span-2" placeholder="Task title *"
              value={newTask.title} onChange={(e) => setNewTask({...newTask,title:e.target.value})} required/>
            <textarea className="input resize-none md:col-span-2" rows={2} placeholder="Description"
              value={newTask.description} onChange={(e) => setNewTask({...newTask,description:e.target.value})}/>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Assign to</label>
              <select className="input" value={newTask.assigned_to_id||''}
                onChange={(e) => setNewTask({...newTask,assigned_to_id:e.target.value||null})}>
                <option value="">Unassigned</option>
                {project?.members?.map((m) => (
                  <option key={m.id} value={m.id}>{m.username}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Deadline</label>
              <input type="datetime-local" className="input"
                value={newTask.deadline} onChange={(e) => setNewTask({...newTask,deadline:e.target.value})}/>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">Create Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key)
          return (
            <div key={col.key}>
              <div className="flex items-center gap-2.5 mb-4 px-1">
                <div className={`w-3 h-3 rounded-full ${col.dot}`}/>
                <h3 className="font-bold text-slate-700 text-sm">{col.label}</h3>
                <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${col.count_bg}`}>
                  {colTasks.length}
                </span>
              </div>
              <div className={`${col.bg} rounded-3xl p-3 space-y-3 min-h-40`}>
                {colTasks.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-8">No tasks</p>
                )}
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isAdmin={isAdmin}
                    onStatusChange={loadData} onDelete={handleDelete}/>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
