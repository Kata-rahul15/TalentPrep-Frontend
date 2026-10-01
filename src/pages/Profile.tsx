import { User, Mail, CheckCircle2, Award } from 'lucide-react'
import { useAuth } from '@/services/authService'
import { motion } from 'framer-motion'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
          User Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your account credentials, target job preferences, and preparation history.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-2xl uppercase border-2 border-primary/20 shadow-inner mb-4">
            {user?.username?.slice(0, 2) || 'US'}
          </div>
          <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">
            {user?.username || 'User'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email || 'user@talentprep.ai'}</p>

          <div className="mt-4 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Account Verified</span>
          </div>

          <div className="w-full border-t border-border my-6" />

          <div className="w-full space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Preparation Plan</span>
              <span className="font-bold text-primary">Pro Prep tier</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Resumes Evaluated</span>
              <span className="font-bold text-foreground">12 scans</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Interviews Completed</span>
              <span className="font-bold text-foreground">8 sessions</span>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white border-b border-border pb-4">
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-secondary-bg/50 border border-border space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <User className="w-4 h-4 text-primary" />
                <span>Full Username</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white pt-1">
                {user?.username || 'Candidate User'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary-bg/50 border border-border space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white pt-1">
                {user?.email || 'candidate@talentprep.ai'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Target Job Domain</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Your profile is configured for Senior Software Engineering and Technical Roleplay scenarios.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
