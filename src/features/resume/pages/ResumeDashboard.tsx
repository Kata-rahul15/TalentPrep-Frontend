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
  Upload,
} from 'lucide-react'
import { useResume, useResumeEvaluation, useResumeOverview } from '../hooks/useResume'
import { useResumeContext } from '../context/ResumeContext'
import { PageLoading, PageError } from '../components/ResumeUI'
import { ScoreRingContainer } from '../components/ScoreRing'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  if (!iso) return 'Recently'
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatDateWithTime(iso: string) {
  if (!iso) return 'Recently'
  try {
    const date = new Date(iso)
    const timeStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date)
    return `Today, ${timeStr}`
  } catch {
    return iso
  }
}

function formatSize(bytes: number) {
  if (!bytes) return 'N/A'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
}

interface ScoreCardProps {
  label: string
  score: number | undefined
  status: string
  statusColor: 'blue' | 'purple' | 'green' | 'amber'
  ringColor: string
  description: string
}

function ScoreCard({ label, score, status, statusColor, ringColor, description }: ScoreCardProps) {
  const statusTextColor = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
  }[statusColor]

  const displayScore = typeof score === 'number' ? Math.round(score) : 0

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
      {/* Ring Gauge */}
      <div className="flex-shrink-0">
        <ScoreRingContainer score={displayScore} size="md" label="/100" color={ringColor} />
      </div>
      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
          {label}
        </h3>
        <p className={cn('text-sm font-semibold mt-0.5', statusTextColor)}>
          {status}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug truncate">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function ResumeDashboard() {
  const navigate = useNavigate()
  const { selectedResumeId } = useResumeContext()

  const { data: resume, isLoading: isResumeLoading, isError: isResumeError, refetch: refetchResume } = useResume(selectedResumeId)

  // Fetch real evaluation & overview for target resume
  const isReady = resume?.status === 'ready'
  const { data: evaluation, isLoading: isEvalLoading } = useResumeEvaluation(resume?.id, isReady)
  const { data: overview } = useResumeOverview(resume?.id, isReady)

  useEffect(() => {
    if (!isResumeLoading && !isResumeError && !resume) {
      navigate('/resume/upload', { replace: true })
    }
  }, [isResumeLoading, isResumeError, resume, navigate])

  if (isResumeLoading) return <PageLoading message="Loading your resume..." />
  if (isResumeError) return <PageError message="Could not load resume data." onRetry={refetchResume} />

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
            Our AI is currently extracting skills, experience, and calculating your ATS score for{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.fileName}</span>.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
          <span>Auto-refreshing status...</span>
        </div>
      </div>
    )
  }

  // ── Failed resume state ───────────────────────────────────────────────────
  if (resume.status === 'failed') {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/60 dark:border-rose-800">
          <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Resume Analysis Could Not Be Completed
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your document <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.fileName}</span> could not be processed. Please try uploading your resume again.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/resume/upload')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Resume</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Resume exists & READY ─────────────────────────────────────────────────
  const scores = evaluation?.scores
  const suggestions = evaluation?.suggestions || []
  const missingKeywords = evaluation?.missingKeywords || []

  // Dynamic helper label based on score value
  const getScoreRating = (val?: number) => {
    if (val === undefined) return { label: 'Evaluating...', color: 'blue' as const }
    if (val >= 80) return { label: 'Strong', color: 'green' as const }
    if (val >= 60) return { label: 'Good', color: 'blue' as const }
    if (val >= 40) return { label: 'Average', color: 'amber' as const }
    return { label: 'Needs Work', color: 'amber' as const }
  }

  const atsRating = getScoreRating(scores?.atsScore)
  const overallRating = getScoreRating(scores?.overallScore)
  const keywordRating = getScoreRating(scores?.keywordMatch)
  const skillsRating = getScoreRating(scores?.technicalSkillsScore)

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
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready
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

      {/* ── 2. Four Score Cards (Using Real Backend Data) ── */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <ScoreCard
          label="ATS Score"
          score={scores?.atsScore}
          status={atsRating.label}
          statusColor={atsRating.color}
          ringColor="#2563EB"
          description={scores?.atsScore !== undefined ? `ATS match rating: ${scores.atsScore}%` : 'Calculating score...'}
        />
        <ScoreCard
          label="Overall Score"
          score={scores?.overallScore}
          status={overallRating.label}
          statusColor={overallRating.color}
          ringColor="#2563EB"
          description={scores?.overallScore !== undefined ? `Overall profile strength: ${scores.overallScore}%` : 'Calculating score...'}
        />
        <ScoreCard
          label="Keyword Match"
          score={scores?.keywordMatch}
          status={keywordRating.label}
          statusColor={keywordRating.color}
          ringColor="#7C3AED"
          description={missingKeywords.length > 0 ? `${missingKeywords.length} missing keywords identified` : 'Keywords analyzed'}
        />
        <ScoreCard
          label="Skills Score"
          score={scores?.technicalSkillsScore}
          status={skillsRating.label}
          statusColor={skillsRating.color}
          ringColor="#10B981"
          description={scores?.technicalSkillsScore !== undefined ? `Technical skill match: ${scores.technicalSkillsScore}%` : 'Analyzing skills...'}
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
                  {overview?.aiInsight ||
                    (evaluation?.strengths?.length
                      ? `Key strength: ${evaluation.strengths[0]}`
                      : 'AI evaluation complete for your uploaded resume.')}
                </p>
                {suggestions.length > 0 && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Identified {suggestions.length} actionable recommendation{suggestions.length > 1 ? 's' : ''} to improve your ATS score.
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/resume/evaluation')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>View Full Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
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
                  Evaluation Summary
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
                    {evaluation?.evaluatedAt ? formatDateWithTime(evaluation.evaluatedAt) : formatDate(resume.uploadedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Suggestions
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {suggestions.length}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Missing Keywords
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {missingKeywords.length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/resume/evaluation')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 rounded-xl hover:bg-blue-100/70 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>View Breakdown</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Top Recommendations (Real Backend Suggestions) */}
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

              {isEvalLoading ? (
                <div className="space-y-3 py-6 text-center text-xs text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                  <span>Loading AI recommendations...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate('/resume/evaluation')}
                      className="flex items-center justify-between gap-3 p-3.5 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {item.section}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {item.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-semibold capitalize text-amber-600 dark:text-amber-400">
                          {item.priority} Priority
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                    No High-Priority Issues
                  </p>
                  <p className="text-xs text-slate-400">
                    Your resume meets key ATS criteria. View details or ATS evaluation for additional insights.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
