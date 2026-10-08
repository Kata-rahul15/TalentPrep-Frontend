import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/services/authService'
import TalentPrepLogo from '@/components/common/TalentPrepLogo'
import { cn } from '@/lib/utils'

export default function AuthenticatedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const navItems = [
    { label: 'Home', to: '/home', activePattern: (path: string) => path === '/home' },
    { label: 'Resume', to: '/resume', activePattern: (path: string) => path.startsWith('/resume') },
    { label: 'Profile', to: '/profile', activePattern: (path: string) => path.startsWith('/profile') },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* ── Left Side: Brand Logo ── */}
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex items-center gap-2 group">
            <TalentPrepLogo size="md" />
          </Link>
        </div>

        {/* ── Center Navigation (Clean & Borderless) ── */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = item.activePattern(location.pathname)
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  'relative font-medium text-sm transition-colors duration-200 py-1 group',
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full bg-primary" />
                ) : (
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary transition-all duration-300 group-hover:w-full opacity-60" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Right Side: User Profile & Logout ── */}
        <div className="hidden md:flex items-center gap-3">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1 hover:bg-secondary-bg/60 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-xs border border-primary/20">
              {user?.username?.slice(0, 2) || 'US'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                {user?.username || 'User'}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">{user?.email || ''}</span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-border" />

          <button
            onClick={handleLogout}
            className="font-medium text-sm text-gray-500 hover:text-danger hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1.5"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* ── Mobile Hamburger Toggle ── */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-secondary-bg"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.activePattern(location.pathname)
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-primary bg-primary/5 font-bold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-secondary-bg'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                {user?.username?.slice(0, 2) || 'US'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{user?.username || 'User'}</span>
                <span className="text-[10px] text-muted-foreground">{user?.email || ''}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleLogout()
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-danger bg-danger/10 hover:bg-danger/20 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
