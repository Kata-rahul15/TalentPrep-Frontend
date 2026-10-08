import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  FileText,
  Sparkles,
  Briefcase,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '@/services/authService'
import TalentPrepLogo from '@/components/common/TalentPrepLogo'
import { cn } from '@/lib/utils'

const workspaceNav = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/agent', label: 'AI Career Agent', icon: Sparkles },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
]

const accountNav = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  // Close on route change
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleLogout = async () => {
    onClose()
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[240px] bg-white dark:bg-slate-900 border-r border-border shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-13 px-3.5 border-b border-border/60 flex-shrink-0">
          <TalentPrepLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          <div className="px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Workspace
            </span>
          </div>
          {workspaceNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-3 pb-1.5 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Account
            </span>
          </div>
          {accountNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-danger/8 hover:text-danger transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>

        {/* User card */}
        {user && (
          <div className="px-3 pb-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/20">
                {user.username?.slice(0, 2) || 'TP'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {user.username || 'User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email || ''}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
