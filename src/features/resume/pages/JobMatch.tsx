import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, PlayCircle, CheckCircle2, XCircle, Tag, Lightbulb, ChevronRight } from 'lucide-react'
import { useJobMatch } from '../hooks/useResume'
import { Button } from '../components/ResumeUI'
import { ScoreRingContainer } from '../components/ScoreRing'
import SkillBadge from '../components/SkillBadge'
import type { JobMatchResult } from '../types/resume.types'

const PLACEHOLDER = `Paste a job description here to match it against your resume...

Example:
We are looking for a Senior Java Backend Engineer with strong experience in Spring Boot and microservices architecture. The ideal candidate will have hands-on experience with Apache Kafka, Redis caching, Docker containerization, and Kubernetes orchestration. Experience with system design, gRPC, and distributed tracing tools like Prometheus and Jaeger is a plus.`

interface ResultPanelProps {
  result: JobMatchResult
}

function ResultPanel({ result }: ResultPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Overall match ring */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreRingContainer score={result.overallMatch} size="lg" label="Match" />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Job Description Match</p>
          <p className={`font-heading font-black text-3xl mb-1 ${
            result.overallMatch >= 80 ? 'text-success' : result.overallMatch >= 60 ? 'text-warning' : 'text-danger'
          }`}>
            {result.overallMatch}%
          </p>
          <p className="text-sm text-muted-foreground">
            {result.overallMatch >= 80
              ? 'Excellent match — you are highly qualified for this role.'
              : result.overallMatch >= 60
              ? 'Good match — a few skill additions could make you a top candidate.'
              : 'Low match — significant skill gaps found for this role.'}
          </p>
        </div>
      </div>

      {/* Matched + Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-success" /> Matched Skills
            <span className="ml-auto text-xs text-success font-semibold">{result.matchedSkills.length} found</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.map((s) => (
              <SkillBadge key={s} label={s} variant="matched" />
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-danger" /> Missing Skills
            <span className="ml-auto text-xs text-danger font-semibold">{result.missingSkills.length} gaps</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.map((s) => (
              <SkillBadge key={s} label={s} variant="missing" />
            ))}
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-warning" /> Missing Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.missingKeywords.map((kw) => (
            <SkillBadge key={kw} label={kw} variant="missing" size="sm" />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" /> Recommendations
        </h3>
        <ul className="space-y-2.5">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function JobMatch() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const jobMatchMutation = useJobMatch()

  const handleMatch = () => {
    if (!jobDescription.trim()) return
    jobMatchMutation.mutate(jobDescription)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-black text-2xl text-foreground">Job Description Match</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Paste any job description to see how well your resume matches the requirements
        </p>
      </motion.div>

      {/* Input Panel */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <h2 className="font-heading font-semibold text-sm text-foreground">Job Description</h2>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={10}
          className="w-full resize-none bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono leading-relaxed"
          aria-label="Job description input"
        />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-muted-foreground">
            {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : 'Paste the full job description for best results'}
          </p>
          <div className="flex gap-2">
            {jobDescription && (
              <Button variant="ghost" size="sm" onClick={() => { setJobDescription(''); jobMatchMutation.reset() }}>
                Clear
              </Button>
            )}
            <Button
              onClick={handleMatch}
              disabled={!jobDescription.trim() || jobMatchMutation.isPending}
              loading={jobMatchMutation.isPending}
            >
              {jobMatchMutation.isPending ? 'Analyzing...' : 'Match Resume'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Error state */}
      {jobMatchMutation.isError && (
        <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl text-sm text-danger">
          Analysis failed. Please try again.
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {jobMatchMutation.data && <ResultPanel result={jobMatchMutation.data} />}
      </AnimatePresence>

      {/* Ready for Interview CTA */}
      {jobMatchMutation.data && jobMatchMutation.data.overallMatch >= 70 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950 text-white rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="font-heading font-bold text-base mb-0.5">Ready for Interview?</p>
            <p className="text-slate-400 text-sm">
              Your {jobMatchMutation.data.overallMatch}% match means you are a strong candidate. Practice now!
            </p>
          </div>
          <Button onClick={() => navigate('/home')} className="bg-white text-slate-950 hover:bg-slate-100">
            <PlayCircle className="w-4 h-4" /> Start Interview
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
