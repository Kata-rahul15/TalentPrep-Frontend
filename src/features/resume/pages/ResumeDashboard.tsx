import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Eye,
  ChevronRight,
  Upload,
  Layers,
  Briefcase,
  FileEdit,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Target,
} from 'lucide-react'
import { useResume, useResumes, useResumeEvaluation, useResumeOverview, useResumeDetails } from '../hooks/useResume'
import { useResumeContext } from '../context/ResumeContext'
import { useAuth } from '@/services/authService'
import { PageLoading, PageError } from '../components/ResumeUI'
import { ScoreRingContainer } from '../components/ScoreRing'
import { resumeApi } from '../api/resumeApi'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  if (!iso) return 'Recently'
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatSize(bytes: number) {
  if (!bytes) return 'N/A'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ResumeDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedResumeId, setSelectedResumeId } = useResumeContext()

  const { data: resumesList } = useResumes()
  const { data: resume, isLoading: isResumeLoading, isError: isResumeError, refetch: refetchResume } = useResume(selectedResumeId)

  // Fetch real evaluation & overview for target resume
  const isReady = resume?.status === 'ready'
  const { data: evaluation, isLoading: isEvalLoading } = useResumeEvaluation(resume?.id, isReady)
  const { data: overview } = useResumeOverview(resume?.id, isReady)
  const { data: details } = useResumeDetails(resume?.id)

  // Recommended Jobs state (fetched dynamically via backend Jobvetta)
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)

  useEffect(() => {
    if (isReady && resume?.id) {
      let isMounted = true
      const fetchRecommended = async () => {
        setIsLoadingJobs(true)
        try {
          // Extract top candidate skills for search query
          const skillTerms = details?.skills
            ? details.skills.split(/[,|\n]+/).slice(0, 3).map((s: string) => s.trim()).join(' ')
            : 'Software Engineer'
          const data = await resumeApi.searchJobs({ q: skillTerms || 'Developer', limit: 4 })
          if (isMounted) {
            setRecommendedJobs(data?.jobs || [])
          }
        } catch (e) {
          console.warn('[ResumeDashboard] Recommended jobs fetch error:', e)
        } finally {
          if (isMounted) setIsLoadingJobs(false)
        }
      }
      fetchRecommended()
      return () => {
        isMounted = false
      }
    }
  }, [isReady, resume?.id, details?.skills])

  if (isResumeLoading) return <PageLoading message="Loading your resume workspace..." />
  if (isResumeError) return <PageError message="Could not load resume data." onRetry={refetchResume} />

  // ── No resume uploaded (Rich Empty State) ──────────────────────────────────
  if (!resume) {
    return (
      <div className="space-y-6 py-4">
        {/* Header Greeting */}
        <div>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
            Welcome, {user?.username || 'Candidate'} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload your resume to get started with AI evaluation, ATS analysis, and continuous improvement.
          </p>
        </div>

        {/* Empty State Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200/60 dark:border-blue-900/60 shadow-inner">
            <Upload className="w-7 h-7" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              No Resume Uploaded Yet
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your PDF or DOCX resume to extract skills, calculate your real ATS score, match job descriptions, and improve sections with AI.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/resume/upload')}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer h-9"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Resume Now</span>
            </button>
            <button
              onClick={() => navigate('/resume/builder')}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer h-9"
            >
              <FileEdit className="w-3.5 h-3.5 text-blue-600" />
              <span>Create in Builder</span>
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Processing resume state ───────────────────────────────────────────────
  if (resume.status === 'processing') {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse border border-blue-200/60 dark:border-blue-800">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Processing Your Resume...
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Our AI is extracting skills, analyzing experience, and computing ATS health metrics for{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.fileName}</span>.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-full text-[11px] font-semibold text-blue-600 dark:text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
          <span>Auto-refreshing status...</span>
        </div>
      </div>
    )
  }

  // ── Failed resume state ───────────────────────────────────────────────────
  if (resume.status === 'failed') {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/60 dark:border-rose-800">
          <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Resume Analysis Could Not Be Completed
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your document <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.fileName}</span> could not be processed. Please try uploading your resume again.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => navigate('/resume/upload')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-2xs cursor-pointer h-8"
          >
            <Upload className="w-3.5 h-3.5" />
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

  const atsScore = scores?.atsScore ?? 0
  const overallScore = scores?.overallScore ?? 0
  const keywordMatch = scores?.keywordMatch ?? 0
  const skillsScore = scores?.technicalSkillsScore ?? 0

  return (
    <div className="space-y-6">
      {/* ── 1. Resume File Bar (Header Strip) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate leading-tight">
                {resume.fileName}
              </h2>
              {resume.version && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 border border-blue-200/60">
                  v{resume.version}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {resume.fileType} • {formatSize(resume.fileSize)} • Uploaded {formatDate(resume.uploadedAt)}
            </p>
          </div>
        </div>

        {/* Action Controls & Multi-resume dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {resumesList && resumesList.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
              <Layers className="w-3 h-3 text-blue-600" />
              <select
                value={resume.id}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {resumesList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => navigate('/resume/builder')}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer h-7.5"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Open Builder</span>
          </button>
          <button
            onClick={() => navigate('/resume/details')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer h-7.5"
          >
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* ── 2. Resume Health Section ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
              Resume Health
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive analysis of ATS compatibility, keyword coverage, and skills alignment
            </p>
          </div>
          <button
            onClick={() => navigate('/resume/evaluation')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Score Breakdown</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4 Score Metrics Gauge Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* ATS Score */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
            <ScoreRingContainer score={atsScore} size="md" label="/100" color="#2563EB" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ATS Score</span>
              <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {atsScore >= 75 ? 'Strong Match' : atsScore >= 50 ? 'Moderate' : 'Needs Optimization'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Parsing & keywords</p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
            <ScoreRingContainer score={overallScore} size="md" label="/100" color="#3B82F6" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Score</span>
              <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {overallScore >= 75 ? 'Excellent' : overallScore >= 50 ? 'Good' : 'Needs Work'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Profile strength</p>
            </div>
          </div>

          {/* Keyword Match */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
            <ScoreRingContainer score={keywordMatch} size="md" label="/100" color="#7C3AED" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword Match</span>
              <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {missingKeywords.length === 0 ? 'Optimal' : `${missingKeywords.length} gaps`}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Industry keywords</p>
            </div>
          </div>

          {/* Skills Score */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
            <ScoreRingContainer score={skillsScore} size="md" label="/100" color="#10B981" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills Score</span>
              <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {skillsScore >= 70 ? 'High Coverage' : 'Standard'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Technical depth</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. AI Resume Insights ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            AI Resume Insights
          </h2>
        </div>

        <div className="bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-slate-50/60 dark:from-blue-950/30 dark:to-slate-900 border border-blue-100/90 dark:border-blue-900/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {overview?.aiInsight ||
                (evaluation?.strengths?.length
                  ? `Key Strength: ${evaluation.strengths[0]}`
                  : 'Your resume has been analyzed by AI. Ready for targeted section improvements.')}
            </p>
            {suggestions.length > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Found {suggestions.length} high-impact suggestion{suggestions.length > 1 ? 's' : ''} to optimize formatting, action verbs, and keyword alignment.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/resume/builder')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer h-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Improve in Builder</span>
            </button>
            <button
              onClick={() => navigate('/resume/evaluation')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors h-8"
            >
              <span>View Analysis</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Your Next Best Actions ── */}
      <div className="space-y-3">
        <div>
          <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
            Your Next Best Actions
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Follow the continuous career flow from resume optimization to job matching and applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Action 1: Improve Resume */}
          <div
            onClick={() => navigate('/resume/builder')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 border border-blue-200/60 dark:border-blue-900/60">
                <FileEdit className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Improve Your Resume
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Refine bullet points, enhance summaries, and customize sections with inline AI polish.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-3 group-hover:translate-x-0.5 transition-transform">
              <span>Open Builder</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action 2: Find Matching Jobs */}
          <div
            onClick={() => navigate('/agent?task=find_jobs')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 border border-emerald-200/60 dark:border-emerald-900/60">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Find Matching Jobs
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Let your AI Career Agent analyze your resume against live opportunities via Jobvetta.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-3 group-hover:translate-x-0.5 transition-transform">
              <span>Launch AI Search</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Action 3: Match Specific JD */}
          <div
            onClick={() => navigate('/agent?task=match_jd')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 border border-purple-200/60 dark:border-purple-900/60">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Match Resume to a JD
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Paste a target job posting to compute precise keyword alignment and missing skills.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 pt-3 group-hover:translate-x-0.5 transition-transform">
              <span>Run Job Match</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Recommended Jobs Section ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Recommended Jobs
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Live opportunities matched to your extracted skills and technical domain
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/jobs')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Explore All Jobs</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {isLoadingJobs ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <RefreshCw className="w-4 h-4 animate-spin mx-auto text-blue-600" />
            <span>Finding real job recommendations...</span>
          </div>
        ) : recommendedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendedJobs.map((job) => (
              <div
                key={job.job_id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    {job.work_model && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex-shrink-0">
                        {job.work_model}
                      </span>
                    )}
                  </div>

                  {job.employment_type && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {job.employment_type}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <button
                    onClick={() => {
                      if (job.description) {
                        navigate('/agent?task=match_jd', { state: { jdText: job.description } })
                      } else {
                        navigate('/agent?task=match_jd', { state: { jdText: `${job.title} at ${job.company}\nLocation: ${job.location}` } })
                      }
                    }}
                    className="font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Match with My Resume
                  </button>

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              No live recommendations ready yet. Visit the Job Explorer or ask your AI Career Agent.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
