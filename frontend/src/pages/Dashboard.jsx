import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tasksAPI } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tasksAPI.dashboard()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </Layout>
  )

  const total   = stats?.total_tasks || 0
  const todo    = stats?.by_status?.todo || 0
  const inProg  = stats?.by_status?.in_progress || 0
  const done    = stats?.by_status?.done || 0
  const overdue = stats?.overdue_count || 0
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{today}</p>
          <h1 className="text-3xl font-black text-slate-800">Hi, {user?.username}!</h1>
          <p className="text-slate-400 text-sm mt-1">
            You have <span className="text-teal-600 font-bold">{todo + inProg} active tasks</span> today.
          </p>
        </div>
        {isAdmin && (
          <Link to="/projects" className="btn-primary">+ New Project</Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Teal hero card */}
        <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-1.5 w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"/>
              <span className="text-xs font-bold">{inProg} Active Task{inProg !== 1 ? 's' : ''}</span>
            </div>
            <h2 className="text-xl font-black mb-1">Overall Progress</h2>
            <p className="text-teal-100 text-sm">{done} of {total} tasks completed</p>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">Completion</span>
              <span className="font-black">{pct}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-white rounded-full h-3 transition-all duration-700"
                style={{ width: `${pct}%` }}/>
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-4 border-t border-white/20 text-xs font-semibold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-300"/>To Do</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-300"/>In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white"/>Done</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'To Do',       count: todo,   bg: 'bg-blue-50',   dot: 'bg-blue-400',   text: 'text-blue-600'  },
            { label: 'In Progress', count: inProg, bg: 'bg-orange-50', dot: 'bg-orange-400', text: 'text-orange-600' },
            { label: 'Completed',   count: done,   bg: 'bg-teal-50',   dot: 'bg-teal-500',   text: 'text-teal-700'  },
            { label: 'Overdue',     count: overdue, bg: overdue > 0 ? 'bg-red-50' : 'bg-green-50',
              dot: overdue > 0 ? 'bg-red-400' : 'bg-green-400', text: overdue > 0 ? 'text-red-600' : 'text-green-600' },
          ].map(({ label, count, bg, dot, text }) => (
            <div key={label} className={`${bg} rounded-3xl p-5 flex flex-col gap-2`}>
              <div className={`w-10 h-10 ${dot} rounded-2xl flex items-center justify-center shadow-sm`}>
                <span className="text-white font-black text-base">{count}</span>
              </div>
              <p className={`font-black text-lg ${text}`}>{count}</p>
              <p className="text-slate-500 text-xs font-semibold">{label}</p>
              {label === 'Overdue' && overdue === 0 && (
                <p className="text-green-500 text-xs font-bold">All on track!</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* My Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-slate-800 text-lg">My Tasks</h2>
          <Link to="/projects" className="text-xs font-bold text-teal-500 hover:text-teal-600">
            View All
          </Link>
        </div>

        {/* Date strip */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() + i)
            const isToday = i === 0
            return (
              <div key={i}
                className={`flex flex-col items-center px-3 py-2 rounded-2xl flex-shrink-0 cursor-pointer transition-all
                  ${isToday
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-200'
                    : 'text-slate-400 hover:bg-teal-50'}`}>
                <span className="text-xs font-medium">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-base font-black mt-0.5 ${isToday ? 'text-white' : 'text-slate-700'}`}>
                  {d.getDate()}
                </span>
              </div>
            )
          })}
        </div>

        {!stats?.my_tasks?.length ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-slate-400 text-sm">No tasks assigned to you yet</p>
            {isAdmin && (
              <Link to="/projects" className="btn-primary inline-block mt-4">
                Create a Project
              </Link>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {stats.my_tasks.map((task, i) => (
              <li key={task.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F0FAFA]
                           hover:bg-teal-50 transition-colors">
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center
                  ${task.status === 'done' ? 'bg-teal-500' : 'border-2 border-teal-200'}`}>
                  {task.status === 'done' && <span className="text-white text-xs">&#10003;</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate
                    ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                    {task.deadline && (
                      <span>Due {new Date(task.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                    )}
                    {task.assigned_to && <span>{task.assigned_to.username}</span>}
                  </p>
                </div>
                <span className={`badge-${task.is_overdue ? 'overdue' : task.status}`}>
                  {task.is_overdue ? 'Overdue' : task.status.replace('_', ' ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}
