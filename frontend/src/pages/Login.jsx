import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { authAPI } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]             = useState('login')
  const [error, setError]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'member' })

  if (user) return <Navigate to="/dashboard" replace />

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      if (mode === 'login') {
        const res = await authAPI.login(form.email, form.password)
        await login(res.data); navigate('/dashboard')
      } else {
        await authAPI.register({ username: form.username, email: form.email, password: form.password, role: form.role })
        const res = await authAPI.login(form.email, form.password)
        await login(res.data); navigate('/dashboard')
      }
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Something went wrong.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-[#E6F7F7] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex gap-10 items-center">

        {/* Left panel */}
        <div className="hidden lg:flex flex-col flex-1 gap-5">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <span className="font-black text-slate-800 text-xl">Taskly</span>
          </div>

          {/* Hero card — teal gradient */}
          <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-teal-200">
            <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"/>
              <span className="text-sm font-bold">Active Tasks</span>
            </div>
            <h2 className="text-2xl font-black mb-2 leading-snug">Get All Jobs<br/>Done!</h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              Manage your team, track projects and tasks — all in one place.
            </p>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold">Overall Progress</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '65%' }}/>
              </div>
            </div>

            {/* Fake avatars */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/20">
              <div className="flex -space-x-2">
                {['A','B','C','D'].map((l, i) => (
                  <div key={i}
                    className={`w-8 h-8 rounded-full border-2 border-teal-500 flex items-center justify-center text-white text-xs font-bold
                      ${['bg-orange-400','bg-blue-400','bg-purple-400','bg-pink-400'][i]}`}>
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-xs text-teal-100 font-medium">+120 team members</span>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm shadow-teal-100">
            <p className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-1">Today</p>
            <h3 className="font-black text-slate-800 text-lg mb-1">3 Active Tasks</h3>
            <p className="text-slate-400 text-sm">Stay on top of your checklist</p>
            <div className="mt-4 space-y-2">
              {['Design homepage mockup','Review API endpoints','Write unit tests'].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                    ${i === 0 ? 'bg-teal-500' : 'border-2 border-slate-200'}`}>
                    {i === 0 && <span className="text-white text-xs">&#10003;</span>}
                  </div>
                  <span className={`text-sm ${i === 0 ? 'line-through text-slate-300' : 'text-slate-600 font-medium'}`}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white rounded-3xl shadow-sm shadow-teal-100 p-8 w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-slate-800 mb-1">
              {mode === 'login' ? 'Welcome back!' : 'Join your team'}
            </h1>
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-teal-50 rounded-2xl p-1 mb-6">
            {['login','register'].map((tab) => (
              <button key={tab} onClick={() => { setMode(tab); setError('') }}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all
                  ${mode === tab ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {tab === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Username</label>
                <input name="username" value={form.username} onChange={handleChange}
                  className="input" placeholder="johndoe" required />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className="input" placeholder="Min. 8 characters" required />
            </div>
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="input">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl px-4 py-3">
                {error}
              </div>
            )}
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base mt-1">
              {submitting ? 'Please wait...' : mode === 'login' ? 'Get Started' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
