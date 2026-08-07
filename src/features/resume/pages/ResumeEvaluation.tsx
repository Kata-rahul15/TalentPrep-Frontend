import { motion } from 'framer-motion'
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Tag,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { useResumeEvaluation } from '../hooks/useResume'
import { PageLoading, PageError, Button } from '../components/ResumeUI'
import ScoreBar from '../components/ScoreBar'
import { ScoreRingContainer } from '../components/ScoreRing'
import SkillBadge from '../components/SkillBadge'
import { useEvaluateResume } from '../hooks/useResume'
import type { ResumeSuggestion } from '../types/resume.types'

const priorityStyles = {
  high: 'bg-danger/10 text-danger border-danger/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-primary/10 text-primary border-primary/20',
}

function SuggestionCard({ suggestion }: { suggestion: ResumeSuggestion }) {
  return (
    <div className="flex gap-3 p-4 bg-card border border-border rounded-xl">
      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border flex-shrink-0 h-fit ${priorityStyles[suggestion.priority]}`}>
        {suggestion.priority}
      </span>
      <div>
        <p className="text-xs font-semibold text-foreground mb-0.5">{suggestion.section}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.message}</p>
      </div>
    </div>
  )
}

export default function ResumeEvaluation() {
  const { data: evaluation, isLoading, isError, refetch } = useResumeEvaluation()
  const evaluateMutation = useEvaluateResume()

  const handleReevaluate = async () => {
    await evaluateMutation.mutateAsync()
  }

  if (isLoading) return <PageLoading message="Running AI evaluation..." />
  if (isError || !evaluation) return <PageError message="Could not load evaluation." onRetry={refetch} />

  const { scores, strengths, weaknesses, suggestions, missingKeywords } = evaluation

  const scoreBreakdownItems = [
    { label: 'ATS Score', score: scores.atsScore },
    { label: 'Keyword Match', score: scores.keywordMatch },
    { label: 'Formatting', score: scores.formattingScore },
    { label: 'Technical Skills', score: scores.technicalSkillsScore },
    { label: 'Experience', score: scores.experienceScore },
    { label: 'Education', score: scores.educationScore },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="font-heading font-black text-2xl text-foreground">ATS Evaluation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-powered resume score breakdown and improvement plan</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReevaluate}
          loading={evaluateMutation.isPending}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate
        </Button>
      </motion.div>

      {/* Overall Score + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Overall Score Ring */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall Score</p>
          <ScoreRingContainer score={scores.overallScore} size="lg" label="/ 100" />
          <div className="text-center">
            <p className={`font-heading font-bold text-sm ${
              scores.overallScore >= 80 ? 'text-success' : scores.overallScore >= 60 ? 'text-warning' : 'text-danger'
            }`}>
              {scores.overallScore >= 80 ? 'Strong Profile' : scores.overallScore >= 60 ? 'Needs Improvement' : 'Weak Profile'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Evaluated {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(evaluation.evaluatedAt))}
            </p>
          </div>
        </motion.div>

        {/* Score Breakdown bars */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Score Breakdown
          </p>
          {scoreBreakdownItems.map((item) => (
            <ScoreBar key={item.label} label={item.label} score={item.score} />
          ))}
        </motion.div>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-success" /> Strengths
          </h3>
          <ul className="space-y-2.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" /> Weaknesses
          </h3>
          <ul className="space-y-2.5">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-primary" /> Improvement Suggestions
        </h3>
        <div className="space-y-3">
          {suggestions.map((suggestion, i) => (
            <SuggestionCard key={i} suggestion={suggestion} />
          ))}
        </div>
      </motion.div>

      {/* Missing Keywords */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-danger" /> Missing Keywords
          <span className="ml-auto text-xs text-muted-foreground font-normal">Add these to boost your ATS score</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw) => (
            <SkillBadge key={kw} label={kw} variant="missing" />
          ))}
        </div>
      </motion.div>

      {/* Upgrade CTA */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-slate-950 text-white rounded-2xl p-6 flex items-center gap-5 flex-wrap"
      >
        <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="font-heading font-bold text-base mb-0.5">Improve your score to 95+</p>
          <p className="text-slate-400 text-sm">Add the missing keywords and apply the suggestions above to significantly boost your ATS ranking.</p>
        </div>
      </motion.div>
    </div>
  )
}
