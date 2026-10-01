import { Video, Sparkles, PlayCircle, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Interview() {
  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
          AI Interview Simulator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Practice technical, behavioral, and HR interview questions with real-time AI feedback.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 shadow-xs border border-primary/20">
          <Video className="w-8 h-8" />
        </div>

        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
          Interactive AI Interview Practice
        </h2>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Select a role, tech stack, or behavioral track to initiate your live AI-powered interview session. Instant performance analytics and speech insights will follow each completed scenario.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left max-w-xl mx-auto">
          <div className="p-4 rounded-2xl bg-secondary-bg/50 border border-border flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">Roleplay Scenarios</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Customized question sets tailored to your target job role.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary-bg/50 border border-border flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">Instant Scoring</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Evaluate technical accuracy, communication clarity, and STAR response format.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => alert('Starting AI Interview session...')}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start Practice Session</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
