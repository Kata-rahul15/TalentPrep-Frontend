import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  FileText,
  Sparkles,
  Briefcase,
  User,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/services/authService'
import { cn } from '@/lib/utils'

const workspaceNav = [
  { to: '/home', label: 'Dashboard', icon: Home, match: (p: string) => p === '/home' },
  { to: '/resume', label: 'My Resume', icon: FileText, match: (p: string) => p.startsWith('/resume') },
  { to: '/jobs', label: 'Jobs', icon: Briefcase, match: (p: string) => p.startsWith('/jobs') },
  { to: '/agent', label: 'AI Career Agent', icon: Sparkles, match: (p: string) => p.startsWith('/agent') },
]

const accountNav = [
  { to: '/profile', label: 'Profile', icon: User, match: (p: string) => p === '/profile' },
  { to: '/settings', label: 'Settings', icon: Settings, match: (p: string) => p === '/settings' },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

/**
 * Robust portal tooltip that escapes sidebar overflow clipping when collapsed.
 */
function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string
  show: boolean
  children: React.ReactNode
}) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)

  if (!show) return <>{children}</>

  return (
    <div
      className="relative flex items-center justify-center w-full"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + 10,
        })
      }}
      onMouseLeave={() => setCoords(null)}
    >
      {children}
      {coords &&
        createPortal(
          <div
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: 'translateY(-50%)',
            }}
            className="fixed z-50 px-2.5 py-1.5 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 text-xs font-medium rounded-lg shadow-lg border border-slate-700/60 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
          >
            {label}
          </div>,
          document.body
        )}
    </div>
  )
}

export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-border transition-all duration-200 ease-in-out select-none',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* ── 1 & 2. Top Header Row ── */}
      <div
        className={cn(
          'flex items-center h-14 border-b border-border/70 flex-shrink-0 transition-all duration-200',
          collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
        )}
      >
        {/* TalentPrep Logo (Expanded state only) */}
        {!collapsed && (
          <div
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0 transition-opacity duration-200"
          >
            {/* Modern TalentPrep Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
              <svg
                className="w-4.5 h-4.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
              TalentPrep
            </span>
          </div>
        )}

        {/* Hamburger / Menu Toggle Button */}
        <SidebarTooltip label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} show={true}>
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </SidebarTooltip>
      </div>

      {/* ── Workspace Navigation ── */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <div className="px-2 mb-1.5 transition-opacity duration-150">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Workspace
            </span>
          </div>
        )}

        {workspaceNav.map((item) => {
          const isActive = item.match(location.pathname)

          const navButton = (
            <NavLink
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg transition-all duration-150 group h-9 w-full',
                collapsed ? 'justify-center px-0' : 'px-2.5',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-4.5 h-4.5 flex-shrink-0 transition-transform duration-150',
                  isActive ? 'text-primary' : 'group-hover:scale-105'
                )}
              />
              {!collapsed && (
                <span className="text-xs font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </NavLink>
          )

          return (
            <div key={item.to} className="w-full flex justify-center">
              <SidebarTooltip label={item.label} show={collapsed}>
                {navButton}
              </SidebarTooltip>
            </div>
          )
        })}
      </nav>

      {/* ── Account Navigation ── */}
      <div className="px-2.5 pb-2 space-y-1 border-t border-border/70 pt-2">
        {!collapsed && (
          <div className="px-2 mb-1 transition-opacity duration-150">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Account
            </span>
          </div>
        )}

        {accountNav.map((item) => {
          const isActive = item.match(location.pathname)

          const navButton = (
            <NavLink
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg transition-all duration-150 h-8.5 w-full group',
                collapsed ? 'justify-center px-0' : 'px-2.5',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-transform duration-150',
                  isActive ? 'text-primary' : 'group-hover:scale-105'
                )}
              />
              {!collapsed && (
                <span className="text-xs font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </NavLink>
          )

          return (
            <div key={item.to} className="w-full flex justify-center">
              <SidebarTooltip label={item.label} show={collapsed}>
                {navButton}
              </SidebarTooltip>
            </div>
          )
        })}

        {/* Logout button */}
        <div className="w-full flex justify-center">
          <SidebarTooltip label="Logout" show={collapsed}>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-3 rounded-lg transition-all duration-150 w-full text-gray-600 dark:text-gray-400 hover:bg-danger/10 hover:text-danger cursor-pointer h-8.5 group',
                collapsed ? 'justify-center px-0' : 'px-2.5'
              )}
            >
              <LogOut className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-105" />
              {!collapsed && (
                <span className="text-xs font-medium leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                  Logout
                </span>
              )}
            </button>
          </SidebarTooltip>
        </div>
      </div>

      {/* ── User Profile Footer ── */}
      {user && (
        <div className="px-2.5 pb-2.5 border-t border-border/70 pt-2 flex justify-center">
          {collapsed ? (
            <SidebarTooltip label={user.username || user.email || 'Profile'} show={true}>
              <div
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {user.username?.slice(0, 2) || 'TP'}
              </div>
            </SidebarTooltip>
          ) : (
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors w-full"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 border border-primary/20">
                {user.username?.slice(0, 2) || 'TP'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate leading-tight">
                  {user.username || 'User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                  {user.email || ''}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
