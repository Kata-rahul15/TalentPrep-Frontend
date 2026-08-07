import { LogOut, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/services/authService'

export default function Home() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // Animation configurations
  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans select-none">
      
      {/* ── Dashboard Top Header Navbar ── */}
      <header className="bg-navbar-bg backdrop-blur-md border-b border-border shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-[1.15rem] tracking-tight text-foreground">
              TalentPrep
            </span>
            <span className="ml-2.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wide border border-primary/20">
              Console
            </span>
          </div>

          {/* User actions / logout */}
          <div className="flex items-center gap-4">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-2.5 cursor-pointer p-1.5 hover:bg-secondary-bg rounded-xl transition-all">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner font-bold text-xs uppercase">
                {user?.username?.slice(0, 2) || 'US'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight">{user?.username || 'User'}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{user?.email || ''}</span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-secondary-foreground hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
              title="Logout from console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 sm:py-16 flex flex-col justify-center items-center">
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Welcome Card Container */}
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            className="w-full bg-card border border-border rounded-3xl shadow-sm p-8 sm:p-12 text-center"
          >
            
            {/* Success Shield Icon */}
            <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center shadow-sm mb-6 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            {/* Title / Hero message */}
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-foreground tracking-tight leading-tight">
              Welcome to TalentPrep
            </h1>
            
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              You have successfully logged in to the AI-powered prep center. Your journey to interview excellence is ready.
            </p>

            {/* Info cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl bg-secondary-bg/30 border border-border flex gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">AI Roleplays</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Practice realistic interactive conversational roleplays with customized bots.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl bg-secondary-bg/30 border border-border flex gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Performance Metrics</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Instantly view technical competence, communication score, and behavioral insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Launch button */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => alert('Mock: Opening interview simulator...')}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                Go to Simulator
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-8 py-3.5 border border-border hover:bg-secondary-bg text-secondary-foreground hover:text-foreground text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer"
              >
                Logout Account
              </button>
            </div>
            
          </motion.div>
          
          <p className="text-xs text-muted-foreground mt-6 select-none">
            TalentPrep v1.0.0 • Premium Dashboard Preview
          </p>
        </div>

      </main>
    </div>
  )
}
