import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, CheckCircle2, Award, KeyRound, LogOut, ShieldAlert, AlertCircle, Lock } from 'lucide-react'
import { useAuth, forgotPassword, getErrorMessage } from '@/services/authService'

export default function Profile() {
  const { user, logout, showToast } = useAuth()
  const [resetRequested, setResetRequested] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const handlePasswordResetRequest = async () => {
    if (!user?.email) return
    setResetLoading(true)
    try {
      await forgotPassword(user.email)
      setResetRequested(true)
      showToast('Password reset OTP sent to your registered email address.', 'success')
    } catch (err: any) {
      showToast(getErrorMessage(err) || 'Failed to initiate password reset.', 'error')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-foreground">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
            Account & Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your credentials, session preferences, and target career domains.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger hover:bg-danger/20 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-danger/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Profile Summary Card */}
        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-3xl uppercase border-2 border-primary/20 shadow-inner mb-4">
            {user?.username?.slice(0, 2) || 'TP'}
          </div>

          <h2 className="font-heading font-bold text-xl text-foreground">
            {user?.username || 'Candidate User'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email || 'user@talentprep.ai'}</p>

          <div className="mt-4 px-3.5 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Candidate</span>
          </div>

          <div className="w-full border-t border-border my-6" />

          <div className="w-full space-y-3.5 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Status</span>
              <span className="font-bold text-success">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-foreground font-semibold">#{user?.userId || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Auth Method</span>
              <span className="font-bold text-primary">JWT HttpOnly Cookie</span>
            </div>
          </div>
        </div>

        {/* Right Settings Tabs / Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Account Details Panel */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-secondary-bg/60 border border-border space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Username</span>
                </div>
                <p className="text-sm font-semibold text-foreground pt-0.5">
                  {user?.username || 'N/A'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary-bg/60 border border-border space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Primary Email</span>
                </div>
                <p className="text-sm font-semibold text-foreground pt-0.5">
                  {user?.email || 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Target Role & Domain</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Configured for Software Engineering, System Architecture, and Technical Interview simulations.
                </p>
              </div>
            </div>
          </div>

          {/* Password Management */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Password & Security
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Initiate a password update by requesting a secure single-use OTP sent directly to your registered email address.
            </p>

            {resetRequested ? (
              <div className="p-4 rounded-2xl bg-success/10 border border-success/20 text-xs text-success font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Password reset OTP dispatched! Check your email inbox to reset your password.</span>
              </div>
            ) : (
              <button
                onClick={handlePasswordResetRequest}
                disabled={resetLoading || !user?.email}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{resetLoading ? 'Sending OTP...' : 'Send Password Reset OTP'}</span>
              </button>
            )}
          </div>

          {/* Account Deletion & Disclaimer Panel */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-lg text-danger border-b border-border pb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-danger" />
              Account Management & Deletion
            </h3>

            <div className="p-4 rounded-2xl bg-secondary-bg border border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Data Deletion Protocol</span>
              </div>
              <p className="leading-relaxed">
                Direct self-service backend account deletion is currently undergoing backend security verification. To permanently purge your account data and resume records, please submit a deletion request to <strong className="text-foreground font-mono">support@talentprep.ai</strong>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
