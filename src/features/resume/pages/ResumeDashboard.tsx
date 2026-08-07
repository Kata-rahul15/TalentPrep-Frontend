import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  FileText,
  BarChart3,
  Briefcase,
  MessageSquare,
  PlayCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { useResume } from '../hooks/useResume'
import { PageLoading, PageError, Button, StatCard } from '../components/ResumeUI'
import { mockEvaluation } from '../mock/resumeMock'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
}

export default function ResumeDashboard() {
  const navigate = useNavigate()
  const { data: resume, isLoading, isError, refetch } = useResume()

  if (isLoading) return <PageLoading message="Loading your resume..." />
  if (isError) return <PageError message="Could not load resume data." onRetry={refetch} />

  // ── No resume uploaded ────────────────────────────────────────────────────
  if (!resume) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-black text-2xl text-foreground mb-1">Resume Dashboard</h1>
          <p className="text-muted-foreground text-sm mb-8">Get started by uploading your resume.</p>

          <div
            onClick={() => navigate('/resume/upload')}
            className="relative group border-2 border-dashed border-border hover:border-primary rounded-3xl p-12 flex flex-col items-center gap-6 bg-card cursor-pointer transition-all hover:bg-secondary-bg/30"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-9 h-9" />
            </div>
            <div className="text-center">
              <h2 className="font-heading font-bold text-xl text-foreground mb-2">Upload Your Resume</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                Upload your resume to get AI-powered ATS scoring, skill gap analysis, and personalized improvement suggestions.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-bg rounded-lg border border-border">
                <FileText className="w-3.5 h-3.5" /> PDF
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-bg rounded-lg border border-border">
                <FileText className="w-3.5 h-3.5" /> DOCX
              </span>
              <span className="px-3 py-1.5 bg-secondary-bg rounded-lg border border-border">Max 10 MB</span>
            </div>
            <Button size="lg" onClick={() => navigate('/resume/upload')}>
              <Upload className="w-4 h-4" /> Upload Resume
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Resume exists ─────────────────────────────────────────────────────────
  const scores = mockEvaluation.scores

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-black text-2xl text-foreground">Resume Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and evaluate your professional resume</p>
        </div>
        <Button onClick={() => navigate('/resume/upload')} variant="secondary" size="sm">
          <RefreshCw className="w-3.5 h-3.5" /> Replace Resume
        </Button>
      </div>

      {/* Resume Info Card */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 flex-wrap"
      >
        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <FileText className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-foreground text-base truncate">{resume.fileName}</h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Uploaded {formatDate(resume.uploadedAt)}
            </span>
            <span className="text-xs text-muted-foreground">{formatSize(resume.fileSize)}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              resume.status === 'ready'
                ? 'bg-success/10 text-success'
                : resume.status === 'processing'
                ? 'bg-warning/10 text-warning'
                : 'bg-danger/10 text-danger'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              {resume.status === 'ready' ? 'Ready' : resume.status === 'processing' ? 'Processing...' : 'Error'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/resume/evaluation')} size="sm">
            <BarChart3 className="w-3.5 h-3.5" /> Evaluate
          </Button>
        </div>
      </motion.div>

      {/* Score Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'ATS Score', value: `${scores.atsScore}%`, icon: <BarChart3 className="w-5 h-5" /> },
          { label: 'Overall Score', value: `${scores.overallScore}%`, icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: 'Keyword Match', value: `${scores.keywordMatch}%`, icon: <FileText className="w-5 h-5" /> },
          { label: 'Skills Score', value: `${scores.technicalSkillsScore}%`, icon: <BarChart3 className="w-5 h-5" /> },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i + 1} variants={cardVariants} initial="hidden" animate="visible">
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
        <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Resume Details',
              description: 'View parsed skills, projects & experience',
              icon: <FileText className="w-5 h-5" />,
              to: '/resume/details',
              color: 'text-primary bg-primary/10',
            },
            {
              label: 'ATS Evaluation',
              description: 'Full score breakdown & suggestions',
              icon: <BarChart3 className="w-5 h-5" />,
              to: '/resume/evaluation',
              color: 'text-success bg-success/10',
            },
            {
              label: 'Job Match',
              description: 'Match resume to a job description',
              icon: <Briefcase className="w-5 h-5" />,
              to: '/resume/job-match',
              color: 'text-warning bg-warning/10',
            },
            {
              label: 'Resume Chat',
              description: 'Ask AI anything about your resume',
              icon: <MessageSquare className="w-5 h-5" />,
              to: '/resume/chat',
              color: 'text-info bg-info/10',
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{action.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Start Interview CTA */}
      <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible"
        className="bg-slate-950 text-white rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h3 className="font-heading font-bold text-lg mb-1">Ready to Interview?</h3>
          <p className="text-slate-400 text-sm">Your ATS score is <strong className="text-white">{scores.atsScore}%</strong> — you're prepared for most roles.</p>
        </div>
        <Button
          onClick={() => navigate('/home')}
          className="bg-white text-slate-950 hover:bg-slate-100 shadow-sm"
        >
          <PlayCircle className="w-4 h-4" /> Start Interview
        </Button>
      </motion.div>
    </div>
  )
}
