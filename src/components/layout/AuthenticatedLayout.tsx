import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import AppSidebar from './AppSidebar'
import MobileDrawer from './MobileDrawer'
import { useAuth } from '@/services/authService'
import { cn } from '@/lib/utils'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* ── Desktop Left Sidebar ── */}
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
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-12 px-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-heading font-bold text-sm tracking-tight text-gray-900 dark:text-white">
              TalentPrep
            </span>
          </div>
        </div>

        {user && (
          <div className="w-6.5 h-6.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] uppercase border border-primary/20">
            {user.username?.slice(0, 2) || 'TP'}
          </div>
        )}
      </header>

      {/* ── Main Content Area ── */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-200 ease-in-out',
          collapsed ? 'md:pl-[68px]' : 'md:pl-[240px]'
        )}
      >
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
