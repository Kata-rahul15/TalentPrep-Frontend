import { motion } from 'framer-motion'
import {
  Server,
  ShieldCheck,
  Brain,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { ServiceConnectionStatus } from '@/hooks/useServiceReadiness'

interface ServiceWakeupScreenProps {
  gatewayStatus: ServiceConnectionStatus
  authStatus: ServiceConnectionStatus
  resumeStatus: ServiceConnectionStatus
  dynamicMessage: string
  isTimedOut: boolean
  isFailed: boolean
  elapsedSeconds: number
  onRetry: () => void
}

function ServiceStatusRow({
  icon: Icon,
  name,
  status,
}: {
  icon: typeof Server
  name: string
  status: ServiceConnectionStatus
}) {
  const getBadgeContent = () => {
    switch (status) {
      case 'ready':
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{status === 'connected' ? 'Connected' : 'Ready'}</span>
          </span>
        )
      case 'unavailable':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200/60 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Unavailable</span>
          </span>
        )
      case 'connecting':
      case 'waking':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/60 dark:border-blue-800">
            <LoaderCircle className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
            <span>{status === 'connecting' ? 'Connecting' : 'Waking up'}</span>
          </span>
        )
    }
  }

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary-bg/60 border border-border transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-xs">
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-foreground">
          {name}
        </span>
      </div>
      {getBadgeContent()}
    </div>
  )
}

export default function ServiceWakeupScreen({
  gatewayStatus,
  authStatus,
  resumeStatus,
  dynamicMessage,
  isTimedOut,
  isFailed,
  elapsedSeconds,
  onRetry,
}: ServiceWakeupScreenProps) {
  const showRetry = isTimedOut || isFailed

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none"
      role="status"
      aria-live="polite"
    >
      {/* Background ambient radial blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-info/6 dark:bg-info/8 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center space-y-6 overflow-hidden"
      >
        {/* Top Indeterminate Progress Shimmer Line */}
        {!showRetry && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-bg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 animate-shimmer" />
          </div>
        )}

        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 pt-2">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
            <svg
              className="w-5 h-5"
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
          <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground">
            TalentPrep
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2 max-w-sm">
          <h1 className="font-heading font-black text-xl sm:text-2xl text-foreground tracking-tight">
            {showRetry ? 'Services are taking longer than expected.' : 'Preparing TalentPrep'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {showRetry
              ? 'Please try again in a moment. Your account and information are safe.'
              : "We're waking up your AI workspace. This may take a few moments."}
          </p>
        </div>

        {/* Dynamic Calm Status Banner */}
        <div className="w-full px-4 py-2.5 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs font-semibold text-primary truncate">
              {dynamicMessage}
            </span>
          </div>
          {!showRetry && (
            <span className="text-[11px] font-mono font-medium text-muted-foreground flex-shrink-0">
              {elapsedSeconds}s
            </span>
          )}
        </div>

        {/* 3 Service Status Rows */}
        <div className="w-full space-y-2.5 text-left">
          <ServiceStatusRow icon={Server} name="API Gateway" status={gatewayStatus} />
          <ServiceStatusRow icon={ShieldCheck} name="Authentication Service" status={authStatus} />
          <ServiceStatusRow icon={Brain} name="Resume AI Service" status={resumeStatus} />
        </div>

        {/* Retry Button (when timed out or failed) */}
        {showRetry && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onRetry}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-bold text-sm rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
