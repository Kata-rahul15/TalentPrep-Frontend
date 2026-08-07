import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/services/authService'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Briefcase,
  MessageSquare,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/resume', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/resume/details', label: 'Resume Details', icon: FileText },
  { to: '/resume/evaluation', label: 'ATS Evaluation', icon: BarChart3 },
  { to: '/resume/job-match', label: 'Job Match', icon: Briefcase },
  { to: '/resume/chat', label: 'Resume Chat', icon: MessageSquare },
]

interface ResumeLayoutProps {
  children: React.ReactNode
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // handled by auth service
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col border-r border-border bg-sidebar-bg fixed top-0 left-0 h-full z-30">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-[1rem] tracking-tight text-foreground">TalentPrep</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Resume Module
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-secondary-foreground hover:bg-secondary-bg hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3 space-y-1">
          <div
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-secondary-bg cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {user?.username?.slice(0, 2) || 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user?.username || 'User'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-secondary-foreground hover:text-danger hover:bg-danger/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <header className="lg:hidden h-14 bg-navbar-bg backdrop-blur-md border-b border-border px-4 flex items-center justify-between z-20 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-heading font-bold text-sm text-foreground">TalentPrep</span>
          </div>
          {/* Mobile nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'p-2 rounded-lg transition-all',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                  )
                }
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
