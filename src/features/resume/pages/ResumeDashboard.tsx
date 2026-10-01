import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Eye,
  ChevronRight,
} from 'lucide-react'
import { useResume, useResumeEvaluation } from '../hooks/useResume'
import { PageLoading, PageError } from '../components/ResumeUI'
import { ScoreRingContainer } from '../components/ScoreRing'
import { mockEvaluation } from '../mock/resumeMock'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

function formatDateWithTime(iso: string) {
  const date = new Date(iso)
  const timeStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date)
  return `Today, ${timeStr}`
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
}

interface ScoreCardProps {
  label: string
  score: number
  status: string
  statusColor: 'blue' | 'purple' | 'green'
  ringColor: string
  description: string
}

function ScoreCard({ label, score, status, statusColor, ringColor, description }: ScoreCardProps) {
  const statusTextColor = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-emerald-600 dark:text-emerald-400',
  }[statusColor]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
      {/* Ring Gauge */}
      <div className="flex-shrink-0">
        <ScoreRingContainer score={score} size="md" label="/100" color={ringColor} />
      </div>
      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
          {label}
        </h3>
        <p className={cn('text-sm font-semibold mt-0.5', statusTextColor)}>
          {status}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function ResumeDashboard() {
  const navigate = useNavigate()
  const { data: resume, isLoading, isError, refetch } = useResume()
  const { data: evaluation } = useResumeEvaluation(!!resume)

  useEffect(() => {
    if (!isLoading && !isError && !resume) {
      navigate('/resume/upload', { replace: true })
    }
  }, [isLoading, isError, resume, navigate])

  if (isLoading) return <PageLoading message="Loading your resume..." />
  if (isError) return <PageError message="Could not load resume data." onRetry={refetch} />

  // ── No resume uploaded ────────────────────────────────────────────────────
  if (!resume) {
    return <PageLoading message="Redirecting to upload..." />
  }

  // ── Processing resume state ───────────────────────────────────────────────
  if (resume.status === 'processing') {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse border border-blue-200/60 dark:border-blue-800">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Processing Your Resume...
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Our AI is currently extracting skills, experience, and calculating your ATS score for <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.fileName}</span>.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
          <span>Auto-refreshing status...</span>
        </div>
      </div>
    )
  }

  // ── Resume exists & ready ──────────────────────────────────────────────────
  const scores = evaluation?.scores || mockEvaluation.scores

  return (
    <div className="space-y-6">
      {/* ── 1. Resume File Card ── */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base md:text-lg truncate">
                {resume.fileName}
              </h2>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border',
                  resume.status === 'ready'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800'
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {resume.status === 'ready' ? 'Ready' : 'Error'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {resume.fileType} • {formatSize(resume.fileSize)} • Uploaded {formatDate(resume.uploadedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/resume/details')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Resume</span>
          </button>
          <button
            onClick={() => navigate('/resume/evaluation')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Evaluate Resume</span>
          </button>
        </div>
      </motion.div>

      {/* ── 2. Four Premium Score Cards ── */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <ScoreCard
          label="ATS Score"
          score={scores.atsScore}
          status="Strong"
          statusColor="blue"
          ringColor="#2563EB"
          description="Your resume is well optimized for ATS."
        />
        <ScoreCard
          label="Overall Score"
          score={scores.overallScore}
          status="Strong"
          statusColor="blue"
          ringColor="#2563EB"
          description="Good overall quality with room to improve."
        />
        <ScoreCard
          label="Keyword Match"
          score={scores.keywordMatch}
          status="Good"
          statusColor="purple"
          ringColor="#7C3AED"
          description="Some important keywords are missing."
        />
        <ScoreCard
          label="Skills Score"
          score={scores.technicalSkillsScore}
          status="Excellent"
          statusColor="green"
          ringColor="#10B981"
          description="Your skills section is well optimized."
        />
      </motion.div>

      {/* ── 3. AI Insight & Recommendations Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: AI Resume Insight & Recent Evaluation */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          {/* AI Resume Insight Card */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                AI Resume Insight
              </h2>
            </div>

            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-5 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-2 z-10 flex-1">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Your resume is strong for backend development roles. You have good technical skills and relevant experience.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We found 3 key areas that could improve your score and increase your chances of getting noticed.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/resume/evaluation')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>View Recommendations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Subtle graphic background on right */}
              <div className="hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex-shrink-0 self-center">
                <FileText className="w-9 h-9 opacity-80" />
              </div>
            </div>
          </motion.div>

          {/* Recent Evaluation Card */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                  Recent Evaluation
                </h2>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Last Evaluated
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {evaluation?.evaluatedAt ? formatDateWithTime(evaluation.evaluatedAt) : 'Today, 10:30 AM'}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Total Improvements
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {evaluation?.suggestions?.length || 3}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Next Evaluation
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    In 7 days
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/resume/evaluation')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 rounded-xl hover:bg-blue-100/70 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Evaluate Again</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Top Recommendations */}
        <div className="lg:col-span-6">
          <motion.div
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 h-full flex flex-col justify-between"
          >
            <div>
              <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-4">
                Top Recommendations
              </h2>

              <div className="space-y-3">
                {/* Recommendation 1 */}
                <div
                  onClick={() => navigate('/resume/evaluation')}
                  className="flex items-center justify-between gap-3 p-3.5 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Add more measurable achievements
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Your experience section has limited quantifiable impact.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      High Impact
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Recommendation 2 */}
                <div
                  onClick={() => navigate('/resume/evaluation')}
                  className="flex items-center justify-between gap-3 p-3.5 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        4 important keywords missing
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Add these keywords to better match job requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Medium Impact
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Recommendation 3 */}
                <div
                  onClick={() => navigate('/resume/evaluation')}
                  className="flex items-center justify-between gap-3 p-3.5 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Skills section looks strong
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Your technical skills are well presented.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Good
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

