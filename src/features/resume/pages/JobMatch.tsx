import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Tag,
  Lightbulb,
  ChevronRight,
  Loader2,
  Circle,
  AlertCircle,
  FileSearch,
  Brain,
  Search,
  Sparkles,
  Calculator,
  RotateCcw,
} from 'lucide-react'

import {
  useJobMatch,
  useJobMatchStatus,
  useResume,
} from '../hooks/useResume'

import {
  Button,
} from '../components/ResumeUI'

import { ScoreRingContainer } from '../components/ScoreRing'
import SkillBadge from '../components/SkillBadge'

import type {
  JobMatchStatus,
  JobMatchStatusResponse,
} from '../types/resume.types'


// ─────────────────────────────────────────────────────────────
// Placeholder
// ─────────────────────────────────────────────────────────────

const PLACEHOLDER = `Paste a job description here to match it against your resume...

Example:
We are looking for a Senior Java Backend Engineer with strong experience in Spring Boot and microservices architecture. The ideal candidate will have hands-on experience with Apache Kafka, Redis caching, Docker containerization, and Kubernetes orchestration. Experience with system design, gRPC, and distributed tracing tools like Prometheus and Jaeger is a plus.`


// ─────────────────────────────────────────────────────────────
// Status configuration
// ─────────────────────────────────────────────────────────────

const STATUS_STEPS: {
  status: JobMatchStatus
  label: string
  description: string
  icon: typeof Brain
}[] = [
    {
      status: 'QUEUED',
      label: 'Preparing your match',
      description: 'Your job match has been queued for processing.',
      icon: FileSearch,
    },
    {
      status: 'ANALYZING_JOB',
      label: 'Analyzing the job description',
      description: 'Identifying skills, requirements, and important keywords.',
      icon: Brain,
    },
    {
      status: 'RETRIEVING_EVIDENCE',
      label: 'Finding relevant experience',
      description: 'Searching your resume for relevant skills, projects, and experience.',
      icon: Search,
    },
    {
      status: 'EVALUATING_MATCH',
      label: 'Comparing your resume',
      description: 'Evaluating your resume against the job requirements.',
      icon: Sparkles,
    },
    {
      status: 'CALCULATING_SCORE',
      label: 'Calculating your match score',
      description: 'Combining the analysis into your final match result.',
      icon: Calculator,
    },
  ]


// ─────────────────────────────────────────────────────────────
// Status helpers
// ─────────────────────────────────────────────────────────────

function getStatusIndex(
  status?: JobMatchStatus
): number {
  if (!status) {
    return -1
  }

  return STATUS_STEPS.findIndex(
    (step) => step.status === status
  )
}


function getStatusTitle(
  status?: JobMatchStatus
): string {
  switch (status) {
    case 'QUEUED':
      return 'Preparing your match'

    case 'ANALYZING_JOB':
      return 'Analyzing the job description'

    case 'RETRIEVING_EVIDENCE':
      return 'Finding relevant experience'

    case 'EVALUATING_MATCH':
      return 'Comparing your resume'

    case 'CALCULATING_SCORE':
      return 'Calculating your match score'

    case 'COMPLETED':
      return 'Match analysis complete'

    case 'FAILED':
      return 'Match analysis failed'

    default:
      return 'Preparing your match'
  }
}


// ─────────────────────────────────────────────────────────────
// Progress UI
// ─────────────────────────────────────────────────────────────

interface MatchProgressProps {
  status?: JobMatchStatus
  errorMessage?: string | null
}


function MatchProgress({
  status,
  errorMessage,
}: MatchProgressProps) {
  const currentIndex =
    getStatusIndex(status)

  const isFailed =
    status === 'FAILED'

  const isCompleted =
    status === 'COMPLETED'

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-card border border-border rounded-2xl p-6"
    >

      {/* Header */}
      <div className="flex items-start gap-4 mb-7">

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isFailed
            ? 'bg-danger/10 text-danger'
            : isCompleted
              ? 'bg-success/10 text-success'
              : 'bg-primary/10 text-primary'
            }`}
        >
          {isFailed ? (
            <AlertCircle className="w-5 h-5" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
        </div>

        <div className="flex-1">

          <h2 className="font-heading font-bold text-base text-foreground">
            {getStatusTitle(status)}
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            {isFailed
              ? 'Something went wrong while processing your match.'
              : isCompleted
                ? 'Your resume has been successfully compared with the job description.'
                : 'Your resume is being analyzed in the background. You can stay on this page while we work.'}
          </p>

        </div>

      </div>


      {/* Progress steps */}
      {!isFailed && (
        <div className="space-y-1">

          {STATUS_STEPS.map(
            (step, index) => {

              const Icon = step.icon

              const isCurrent =
                step.status === status

              const isDone =
                isCompleted ||
                index < currentIndex

              const isUpcoming =
                !isDone &&
                !isCurrent

              return (
                <div
                  key={step.status}
                  className="relative flex gap-4"
                >

                  {/* Vertical line */}
                  {index <
                    STATUS_STEPS.length - 1 && (
                      <div
                        className={`absolute left-[18px] top-10 w-px h-[calc(100%-2px)] ${isDone
                          ? 'bg-success/40'
                          : 'bg-border'
                          }`}
                      />
                    )}

                  {/* Step icon */}
                  <div
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border ${isDone
                      ? 'bg-success/10 border-success/30 text-success'
                      : isCurrent
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-muted/30 border-border text-muted-foreground/50'
                      }`}
                  >

                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Icon className="w-4 h-4" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}

                  </div>


                  {/* Step content */}
                  <div
                    className={`pb-5 flex-1 ${isUpcoming
                      ? 'opacity-50'
                      : ''
                      }`}
                  >

                    <div className="flex items-center gap-2">

                      <p
                        className={`text-sm font-semibold ${isCurrent
                          ? 'text-primary'
                          : isDone
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                          }`}
                      >
                        {step.label}
                      </p>

                      {isCurrent && (
                        <Loader2
                          className="w-3.5 h-3.5 text-primary animate-spin"
                        />
                      )}

                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.description}
                    </p>

                  </div>

                </div>
              )
            }
          )}

        </div>
      )}


      {/* Failed message */}
      {isFailed && (
        <div className="mt-4 p-4 rounded-xl bg-danger/5 border border-danger/20">

          <div className="flex items-start gap-3">

            <AlertCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />

            <div>

              <p className="text-sm font-semibold text-danger">
                Match processing failed
              </p>

              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {errorMessage ||
                  'The server could not complete the job match. Please try again.'}
              </p>

            </div>

          </div>

        </div>
      )}

    </motion.div>
  )
}


// ─────────────────────────────────────────────────────────────
// Result Panel
// ─────────────────────────────────────────────────────────────

interface ResultPanelProps {
  result: JobMatchStatusResponse
}


function ResultPanel({
  result,
}: ResultPanelProps) {

  const overallMatch =
    result.overallMatch ?? 0

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-5"
    >

      {/* Overall score */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">

        <ScoreRingContainer
          score={overallMatch}
          size="lg"
          label="Match"
        />

        <div className="flex-1 text-center sm:text-left">

          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Job Description Match
          </p>

          <p
            className={`font-heading font-black text-3xl mb-1 ${overallMatch >= 80
              ? 'text-success'
              : overallMatch >= 60
                ? 'text-warning'
                : 'text-danger'
              }`}
          >
            {overallMatch}%
          </p>

          <p className="text-sm text-muted-foreground">
            {overallMatch >= 80
              ? 'Your resume closely aligns with the supplied job requirements.'
              : overallMatch >= 60
                ? 'Your resume has several matching requirements, with some gaps to review.'
                : 'Your resume has several gaps compared with the supplied job requirements.'}
          </p>

        </div>

      </div>


      {/* Matched + Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Matched */}
        <div className="bg-card border border-border rounded-2xl p-5">

          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">

            <CheckCircle2 className="w-4 h-4 text-success" />

            Matched Skills

            <span className="ml-auto text-xs text-success font-semibold">
              {result.matchedSkills.length} found
            </span>

          </h3>

          <div className="flex flex-wrap gap-2">

            {result.matchedSkills.length > 0 ? (
              result.matchedSkills.map(
                (skill) => (
                  <SkillBadge
                    key={skill}
                    label={skill}
                    variant="matched"
                  />
                )
              )
            ) : (
              <p className="text-xs text-muted-foreground">
                No matched skills identified.
              </p>
            )}

          </div>

        </div>


        {/* Missing */}
        <div className="bg-card border border-border rounded-2xl p-5">

          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">

            <XCircle className="w-4 h-4 text-danger" />

            Missing Skills

            <span className="ml-auto text-xs text-danger font-semibold">
              {result.missingSkills.length} gaps
            </span>

          </h3>

          <div className="flex flex-wrap gap-2">

            {result.missingSkills.length > 0 ? (
              result.missingSkills.map(
                (skill) => (
                  <SkillBadge
                    key={skill}
                    label={skill}
                    variant="missing"
                  />
                )
              )
            ) : (
              <p className="text-xs text-muted-foreground">
                No missing skills identified.
              </p>
            )}

          </div>

        </div>

      </div>


      {/* Missing keywords */}
      <div className="bg-card border border-border rounded-2xl p-5">

        <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">

          <Tag className="w-4 h-4 text-warning" />

          Missing Keywords

        </h3>

        <div className="flex flex-wrap gap-2">

          {result.missingKeywords.length > 0 ? (
            result.missingKeywords.map(
              (keyword) => (
                <SkillBadge
                  key={keyword}
                  label={keyword}
                  variant="missing"
                  size="sm"
                />
              )
            )
          ) : (
            <p className="text-xs text-muted-foreground">
              No missing keywords identified.
            </p>
          )}

        </div>

      </div>


      {/* Recommendations */}
      <div className="bg-card border border-border rounded-2xl p-5">

        <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mb-3">

          <Lightbulb className="w-4 h-4 text-primary" />

          Recommendations

        </h3>

        {result.recommendations.length > 0 ? (
          <ul className="space-y-2.5">

            {result.recommendations.map(
              (recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed"
                >

                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />

                  {recommendation}

                </li>
              )
            )}

          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">
            No additional recommendations were generated.
          </p>
        )}

      </div>

    </motion.div>
  )
}


// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function JobMatch() {

  const navigate = useNavigate()

  const [jobDescription, setJobDescription] =
    useState('')

  const [activeMatchId, setActiveMatchId] =
    useState<string | undefined>()


  // ───────────────────────────────────────────────────────────
  // Resume
  // ───────────────────────────────────────────────────────────

  const {
    data: resume,
    isLoading: isResumeLoading,
  } = useResume()


  // ───────────────────────────────────────────────────────────
  // Start matching
  // ───────────────────────────────────────────────────────────

  const jobMatchMutation =
    useJobMatch()


  // ───────────────────────────────────────────────────────────
  // Poll background match
  // ───────────────────────────────────────────────────────────

  const jobMatchStatusQuery =
    useJobMatchStatus(
      resume?.id,
      activeMatchId
    )


  const status =
    jobMatchStatusQuery.data?.status


  const isProcessing =
    Boolean(activeMatchId) &&
    status !== 'COMPLETED' &&
    status !== 'FAILED'


  // ───────────────────────────────────────────────────────────
  // Start match
  // ───────────────────────────────────────────────────────────
  const handleMatch = () => {
    const cleanedJobDescription =
      jobDescription.trim()

    if (!cleanedJobDescription) {
      return
    }

    if (!resume?.id) {
      console.error(
        '[Job Match] No resume ID available'
      )

      return
    }

    setActiveMatchId(undefined)

    console.log(
      '[Job Match] Starting async match:',
      {
        resumeId: resume.id,
        jobDescriptionLength:
          cleanedJobDescription.length,
      }
    )

    jobMatchMutation.mutate(
      {
        input: {
          description: cleanedJobDescription,
        },

        resumeId: resume.id,
      },

      {
        onSuccess: (data) => {
          console.log(
            '[Job Match] Match queued:',
            data
          )

          setActiveMatchId(
            data.matchId
          )
        },
      }
    )
  }
  // ───────────────────────────────────────────────────────────
  // Clear
  // ───────────────────────────────────────────────────────────

  const handleClear = () => {

    setJobDescription('')

    setActiveMatchId(undefined)

    jobMatchMutation.reset()

  }


  // ───────────────────────────────────────────────────────────
  // Retry
  // ───────────────────────────────────────────────────────────

  const handleRetry = () => {

    setActiveMatchId(undefined)

    jobMatchMutation.reset()


    // Keep the job description.
    // User can press Match Resume again.
  }


  const result =
    status === 'COMPLETED'
      ? jobMatchStatusQuery.data
      : undefined


  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ─────────────────────────────────────────────── */}
      {/* Header */}
      {/* ─────────────────────────────────────────────── */}

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">

            <Briefcase className="w-5 h-5" />

          </div>

          <div>

            <h1 className="font-heading font-black text-2xl text-foreground">
              Job Description Match
            </h1>

            <p className="text-sm text-muted-foreground mt-0.5">
              Compare your resume against any job description and discover where you align and where you have gaps.
            </p>

          </div>

        </div>

      </motion.div>


      {/* ─────────────────────────────────────────────── */}
      {/* Input Panel */}
      {/* ─────────────────────────────────────────────── */}

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >

        <div className="flex items-center gap-2">

          <Briefcase className="w-4 h-4 text-primary" />

          <h2 className="font-heading font-semibold text-sm text-foreground">
            Job Description
          </h2>

        </div>


        <textarea
          value={jobDescription}
          onChange={(event) =>
            setJobDescription(
              event.target.value
            )
          }
          placeholder={PLACEHOLDER}
          rows={10}
          disabled={isProcessing}
          className="w-full resize-none bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="job description input"
        />


        <div className="flex items-center justify-between flex-wrap gap-3">

          <p className="text-xs text-muted-foreground">

            {jobDescription.length > 0
              ? `${jobDescription
                .split(/\s+/)
                .filter(Boolean)
                .length} words`
              : 'Paste the full job description for best results'}

          </p>


          <div className="flex gap-2">

            {jobDescription && !isProcessing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                Clear
              </Button>
            )}


            <Button
              onClick={handleMatch}
              disabled={
                !jobDescription.trim() ||
                !resume?.id ||
                isResumeLoading ||
                jobMatchMutation.isPending ||
                isProcessing
              }
              loading={
                jobMatchMutation.isPending
              }
            >

              {jobMatchMutation.isPending
                ? 'Starting...'
                : isProcessing
                  ? 'Matching...'
                  : isResumeLoading
                    ? 'Loading Resume...'
                    : 'Match Resume'}

            </Button>

          </div>

        </div>

      </motion.div>


      {/* ─────────────────────────────────────────────── */}
      {/* Starting state */}
      {/* ─────────────────────────────────────────────── */}

      <AnimatePresence>

        {jobMatchMutation.isPending && (
          <MatchProgress
            status="QUEUED"
          />
        )}

      </AnimatePresence>


      {/* ─────────────────────────────────────────────── */}
      {/* Background processing */}
      {/* ─────────────────────────────────────────────── */}

      <AnimatePresence>

        {activeMatchId &&
          status &&
          status !== 'COMPLETED' &&
          status !== 'FAILED' && (
            <MatchProgress
              status={status}
            />
          )}

      </AnimatePresence>


      {/* ─────────────────────────────────────────────── */}
      {/* Failed state */}
      {/* ─────────────────────────────────────────────── */}

      <AnimatePresence>

        {status === 'FAILED' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="space-y-3"
          >

            <MatchProgress
              status="FAILED"
              errorMessage={
                jobMatchStatusQuery.data?.errorMessage
              }
            />

            <div className="flex justify-end">

              <Button
                variant="outline"
                onClick={handleRetry}
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>

            </div>

          </motion.div>
        )}

      </AnimatePresence>


      {/* ─────────────────────────────────────────────── */}
      {/* Status polling error */}
      {/* ─────────────────────────────────────────────── */}

      {jobMatchStatusQuery.isError && (
        <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl">

          <div className="flex items-start gap-3">

            <AlertCircle className="w-4 h-4 text-danger mt-0.5" />

            <div>

              <p className="text-sm font-semibold text-danger">
                Unable to retrieve match status
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                The match may still be processing. Please try refreshing the page.
              </p>

            </div>

          </div>

        </div>
      )}


      {/* ─────────────────────────────────────────────── */}
      {/* Results */}
      {/* ─────────────────────────────────────────────── */}

      <AnimatePresence>

        {result && (
          <ResultPanel
            result={result}
          />
        )}

      </AnimatePresence>


      {/* ─────────────────────────────────────────────── */}
      {/* Ready for interview */}
      {/* ─────────────────────────────────────────────── */}

      {result &&
        result.overallMatch !== null &&
        result.overallMatch >= 70 && (

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-slate-950 text-white rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
          >

            <div>

              <p className="font-heading font-bold text-base mb-0.5">
                Ready for Interview?
              </p>

              <p className="text-slate-400 text-sm">
                Your {result.overallMatch}% match
                indicates how closely your resume
                aligns with the supplied job requirements.
              </p>

            </div>


            <Button
              onClick={() =>
                navigate('/home')
              }
              className="bg-white text-slate-950 hover:bg-slate-100"
            >

              <PlayCircle className="w-4 h-4" />

              Start Interview

              <ChevronRight className="w-4 h-4" />

            </Button>

          </motion.div>
        )}

    </div>
  )
}