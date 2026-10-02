import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Briefcase,
  MessageSquare,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ResumeProvider } from '../context/ResumeContext'
import ResumeProcessingModal from './ResumeProcessingModal'

const resumeNavItems = [
  { to: '/resume', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/resume/details', label: 'Details', icon: FileText },
  { to: '/resume/evaluation', label: 'ATS Analysis', icon: BarChart3 },
  { to: '/resume/job-match', label: 'Job Match', icon: Briefcase },
  { to: '/resume/chat', label: 'AI Chat', icon: MessageSquare },
]

interface ResumeLayoutContentProps {
  children: React.ReactNode
}

function ResumeLayoutContent({ children }: ResumeLayoutContentProps) {
  const navigate = useNavigate()

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ── 1. Resume Workspace Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
            Resume Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze, evaluate, and optimize your resume
          </p>
        </div>
        <button
          onClick={() => navigate('/resume/upload')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
          <span>Replace Resume</span>
        </button>
      </div>

      {/* ── 2. Horizontal Secondary Resume Navbar ── */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none pb-0">
          {resumeNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-all flex-shrink-0',
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── 3. Subsection Content ── */}
      <main className="w-full pt-1">
        {children}
      </main>

      {/* ── 4. Global Processing Modal ── */}
      <ResumeProcessingModal />
    </div>
  )
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResumeProvider>
      <ResumeLayoutContent>{children}</ResumeLayoutContent>
    </ResumeProvider>
  )
}
