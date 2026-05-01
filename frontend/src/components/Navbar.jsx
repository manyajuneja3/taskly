import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)

const ProjectsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7a2 2 0 0 1 2-2h4l2 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <line x1="12" y1="10" x2="12" y2="18"/>
  </svg>
)

const NAV = [
  { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/projects',  icon: <ProjectsIcon />,  label: 'Projects'  },
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <aside className="w-64 min-h-screen bg-[#E6F7F7] flex flex-col py-8 px-4 flex-shrink-0">

      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center shadow-md shadow-teal-200">
          <span className="text-white font-black text-lg">T</span>
        </div>
        <span className="font-black text-slate-800 text-base tracking-tight">Taskly</span>
      </div>

      {/* User card */}
      <div className="bg-white rounded-3xl p-4 mb-8 shadow-sm shadow-teal-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-200">
          <span className="text-white font-bold text-base">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-800 truncate">{user?.username}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
            ${isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest px-4 mb-2">Menu</p>
        {NAV.map(({ to, icon, label }) => (
          <Link key={to} to={to}
            className={pathname.startsWith(to) ? 'nav-link-active' : 'nav-link'}>
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout}
        className="nav-link w-full text-left text-red-400 hover:bg-red-50 hover:text-red-500 mt-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </aside>
  )
}
