import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import MobileDrawer from './MobileDrawer'
import { useAuth } from '@/services/authService'
import TalentPrepLogo from '@/components/common/TalentPrepLogo'
import { cn } from '@/lib/utils'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('talentprep_sidebar_collapsed')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    try {
      localStorage.setItem('talentprep_sidebar_collapsed', JSON.stringify(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed])

  const userInitial = user?.username ? user.username.slice(0, 2).toUpperCase() : 'TP'

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-foreground flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-600">
      {/* ── Desktop Left Sidebar (Primary Navigation) ── */}
      <div className="hidden md:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* ── Mobile Drawer ── */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* ── Mobile Top Header (hidden on md+) ── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-13 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <TalentPrepLogo size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase border border-blue-200/60 dark:border-blue-900/60"
          >
            {userInitial}
          </button>
        </div>
      </header>

      {/* ── Main Content Area (Starts at top of viewport on desktop, NO top navbar) ── */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'md:pl-[64px]' : 'md:pl-[240px]'
        )}
      >
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
