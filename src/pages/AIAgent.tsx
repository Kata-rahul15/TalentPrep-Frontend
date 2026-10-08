import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Bot,
  User,
  Send,
  Loader2,
  Trash2,
  Search,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Briefcase,
  Target,
  FileEdit,
  ArrowRight,
  Calculator,
  Tag,
  Lightbulb,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
} from 'lucide-react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { ResumeProvider, useResumeContext } from '@/features/resume/context/ResumeContext'
import { useResume, useResumeDetails, useResumeEvaluation, useResumeChat, useJobMatch, useJobMatchStatus } from '@/features/resume/hooks/useResume'
import { ScoreRingContainer } from '@/features/resume/components/ScoreRing'
import { resumeApi } from '@/features/resume/api/resumeApi'
import { cn } from '@/lib/utils'

type AgentTab = 'chat' | 'find_jobs' | 'match_jd' | 'skill_gaps'

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }

    const lines = part.split('\n')
    return lines.map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < lines.length - 1 && <br />}
      </span>
    ))
  })
}

// ─────────────────────────────────────────────────────────────
// 1. CONVERSATIONAL RAG CHAT COMPONENT
// ─────────────────────────────────────────────────────────────
function AgentChatPanel({ onTriggerAction }: { onTriggerAction: (action: string) => void }) {
  const { messages, isLoading, error, sendMessage, clearHistory } = useResumeChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    sendMessage(trimmed)
    setInput('')
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const starterPrompts = [
    'Analyze my resume and highlight my 3 strongest selling points.',
    'What technical interview questions should I expect based on my background?',
    'How can I improve my work experience bullet points for higher ATS ranking?',
    'What leadership and architecture keywords should I add to my resume?',
  ]

  return (
    <div className="flex flex-col h-[520px] bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            TalentPrep Grounded AI Assistant
          </span>
          <span className="text-[10px] text-slate-400">| Powered by Resume RAG & PGVector</span>
        </div>

        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 px-2 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600'
                )}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={cn(
                  'max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-2xs'
                )}
              >
                {renderMarkdown(msg.content)}

                {msg.role === 'assistant' && msg.toolTrace && msg.toolTrace.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                      Tool Activity
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {msg.toolTrace.map((tool) => (
                        <span key={tool} className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[9px] font-medium border border-blue-200/60 dark:border-blue-900/60">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p
                  className={cn(
                    'text-[9px] mt-1 text-right',
                    msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                  )}
                >
                  {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(msg.timestamp))}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl rounded-tl-xs flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Generating reasoned response...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-600">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      {messages.length <= 1 && (
        <div className="px-3.5 py-2 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Suggested Career Questions
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about resume improvements, career advice, target interview topics... (Enter to send)"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 max-h-24 leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. FIND JOBS MATCHING MY RESUME TASK WORKFLOW
// ─────────────────────────────────────────────────────────────
function FindMatchingJobsWorkflow() {
  const navigate = useNavigate()
  const { selectedResumeId } = useResumeContext()
  const { data: resume } = useResume(selectedResumeId)
  const { data: details } = useResumeDetails(selectedResumeId)

  const [stage, setStage] = useState<'analyzing' | 'searching' | 'comparing' | 'complete'>('analyzing')
  const [jobs, setJobs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const runJobSearchWorkflow = async () => {
      setStage('analyzing')
      setError(null)

      // Step 1: Simulated Analysis Step
      await new Promise((r) => setTimeout(r, 600))
      if (cancelled) return
      setStage('searching')

      try {
        // Step 2: Determine a role-based search query from the resume.
        // Never concatenate raw resume skills such as
        // "Java (Core Java Java 8+" into a Google Jobs query.
        const buildRoleQuery = () => {
          const skills = (details?.skills || '').toLowerCase()
          const summary = (details?.summary || '').toLowerCase()
          const experience = (details?.experience || '').toLowerCase()
          const profile = `${summary} ${experience} ${skills}`

          if (profile.includes('java') && (
            profile.includes('spring boot') ||
            profile.includes('springboot') ||
            profile.includes('microservices') ||
            profile.includes('backend') ||
            profile.includes('back-end')
          )) {
            return 'Java Backend Developer'
          }

          if (profile.includes('java')) return 'Java Developer'

          if (profile.includes('react') && (
            profile.includes('node') ||
            profile.includes('full stack') ||
            profile.includes('full-stack')
          )) {
            return 'Full Stack Developer'
          }

          if (profile.includes('python') && (
            profile.includes('django') ||
            profile.includes('flask') ||
            profile.includes('fastapi') ||
            profile.includes('backend')
          )) {
            return 'Python Backend Developer'
          }

          if (profile.includes('devops') || (profile.includes('kubernetes') && profile.includes('cloud'))) {
            return 'DevOps Engineer'
          }

          if (profile.includes('data engineer')) return 'Data Engineer'
          if (profile.includes('machine learning') || profile.includes('machine-learning')) return 'Machine Learning Engineer'
          if (profile.includes('ai engineer') || profile.includes('artificial intelligence')) return 'AI Engineer'

          const roleMatch = profile.match(/(?:senior|sr\.?|junior|jr\.?|lead)?\s*(software engineer|software developer|backend developer|frontend developer|full stack developer|data engineer|devops engineer|platform engineer|qa engineer|test engineer)/i)
          if (roleMatch?.[1]) return roleMatch[1].replace(/\s+/g, ' ').trim()

          return 'Software Engineer'
        }

        const roleQuery = buildRoleQuery()
        console.info('[AgentJobSearch] Role-based query:', roleQuery)

        // The Job Explorer currently targets India by default. Keep the
        // location explicit so AI search never sends an empty location.
        const result = await resumeApi.searchJobs({
          q: roleQuery,
          location: 'India',
          days: 30,
          limit: 10,
        })

        if (cancelled) return
        setStage('comparing')
        await new Promise((r) => setTimeout(r, 500))

        if (cancelled) return
        setJobs(result?.jobs || [])
        setStage('complete')
      } catch (err: any) {
        console.error('[AgentJobSearch] Failed:', err)
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || 'Failed to search matching jobs.')
          setStage('complete')
        }
      }
    }

    runJobSearchWorkflow()
    return () => {
      cancelled = true
    }
  }, [selectedResumeId, details])

  return (
    <div className="space-y-4">
      {/* Tool Execution Activity Progress */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              AI Jobvetta Agent Activity
            </h3>
          </div>
          {stage !== 'complete' && (
            <span className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> In Progress
            </span>
          )}
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Resume profile analyzed ({resume?.fileName || 'Active resume'})</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {stage === 'analyzing' ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            )}
            <span className={cn('font-medium', stage === 'analyzing' ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300')}>
              Searching job opportunities with Jobvetta
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {stage === 'analyzing' || stage === 'searching' ? (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 flex-shrink-0" />
            ) : stage === 'comparing' ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            )}
            <span className={cn('font-medium', stage === 'comparing' ? 'text-blue-600' : stage === 'complete' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400')}>
              Comparing live job requirements against your resume qualifications
            </span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600">
          {error}
        </div>
      )}

      {/* Results */}
      {stage === 'complete' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Matched Opportunities ({jobs.length} found)
            </h3>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Open in Job Explorer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {job.title}
                      </h4>
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
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                    >
                      <span>View & Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (job.description) {
                        navigate('/agent?task=match_jd', { state: { jdText: job.description } })
                      } else {
                        navigate('/agent?task=match_jd', { state: { jdText: `${job.title} at ${job.company}\nLocation: ${job.location}` } })
                      }
                    }}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                  >
                    Match Breakdown
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. MATCH MY RESUME TO A JOB DESCRIPTION TASK WORKFLOW
// ─────────────────────────────────────────────────────────────
function MatchJobDescriptionWorkflow({ initialJdText }: { initialJdText?: string }) {
  const navigate = useNavigate()
  const { selectedResumeId } = useResumeContext()
  const { data: resume } = useResume(selectedResumeId)

  const [jobDescription, setJobDescription] = useState(initialJdText || '')
  const [activeMatchId, setActiveMatchId] = useState<string | undefined>()

  const jobMatchMutation = useJobMatch()
  const jobMatchStatusQuery = useJobMatchStatus(resume?.id, activeMatchId)
  const status = jobMatchStatusQuery.data?.status
  const isProcessing = Boolean(activeMatchId) && status !== 'COMPLETED' && status !== 'FAILED'

  const handleMatch = () => {
    const cleaned = jobDescription.trim()
    if (!cleaned || !resume?.id || isProcessing || jobMatchMutation.isPending) return

    setActiveMatchId(undefined)
    jobMatchMutation.mutate(
      {
        input: { description: cleaned },
        resumeId: resume.id,
      },
      {
        onSuccess: (data) => {
          setActiveMatchId(data.matchId)
        },
      }
    )
  }

  const result = status === 'COMPLETED' ? jobMatchStatusQuery.data : undefined

  return (
    <div className="space-y-4">
      {/* JD Input Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
        <div>
          <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            Target Job Description
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Paste the full job posting text to analyze skill gaps and keyword alignment against your resume.
          </p>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description requirements, responsibilities, and qualifications here..."
          rows={5}
          disabled={isProcessing || jobMatchMutation.isPending}
          className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <span className="text-[11px] text-slate-400">
            {jobDescription.length} characters
          </span>

          <button
            onClick={handleMatch}
            disabled={!jobDescription.trim() || !resume?.id || isProcessing || jobMatchMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            {isProcessing || jobMatchMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Match...</span>
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5" />
                <span>Analyze Match</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Progress State */}
      {(isProcessing || jobMatchMutation.isPending) && (
        <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-center space-y-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-semibold text-blue-600">Comparing resume against job requirements...</p>
        </div>
      )}

      {/* Match Results Panel */}
      {result && (
        <div className="space-y-3.5">
          {/* Top Overall Score Card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-2xs">
            <div className="flex items-center gap-4">
              <ScoreRingContainer score={result.overallMatch ?? 0} size="lg" label="Match" color="#2563EB" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match Compatibility</span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  {result.overallMatch}% Overall Fit
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {(result.overallMatch ?? 0) >= 75
                    ? 'Strong alignment with key requirements.'
                    : 'Moderate alignment with noticeable skill gaps.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/resume/builder')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Improve Resume for This Job</span>
            </button>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Matched */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strong Matches ({result.matchedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200/60 dark:border-emerald-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                <XCircle className="w-3.5 h-3.5" />
                <span>Missing / Weak Areas ({result.missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200/60 dark:border-rose-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Recommended Improvements</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN AI CAREER AGENT PAGE
// ─────────────────────────────────────────────────────────────
function AIAgentInner() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTask = searchParams.get('task') || (location.state?.jdText ? 'match_jd' : 'chat')
  const [activeTab, setActiveTab] = useState<AgentTab>(() => {
    if (initialTask === 'find_jobs') return 'find_jobs'
    if (initialTask === 'match_jd') return 'match_jd'
    return 'chat'
  })

  const jdTextState = location.state?.jdText

  useEffect(() => {
    const task = searchParams.get('task')
    if (task === 'find_jobs') setActiveTab('find_jobs')
    else if (task === 'match_jd') setActiveTab('match_jd')
  }, [searchParams])

  const setTabWithUrl = (tab: AgentTab) => {
    setActiveTab(tab)
    if (tab === 'chat') {
      setSearchParams({})
    } else {
      setSearchParams({ task: tab })
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Career Copilot</span>
        </div>
        <h1 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight leading-tight">
          AI Career Agent
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
          Your AI career copilot to analyze resumes, find matching opportunities, and optimize applications.
        </p>
      </div>

      {/* ── Contextual Action Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setTabWithUrl('chat')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap',
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask About My Career</span>
        </button>

        <button
          onClick={() => setTabWithUrl('find_jobs')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap',
            activeTab === 'find_jobs'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Jobs Matching My Resume</span>
        </button>

        <button
          onClick={() => setTabWithUrl('match_jd')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap',
            activeTab === 'match_jd'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Match My Resume to a Job Description</span>
        </button>

        <button
          onClick={() => navigate('/resume/builder')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap ml-auto"
        >
          <FileEdit className="w-3.5 h-3.5 text-blue-600" />
          <span>Improve My Resume</span>
        </button>
      </div>

      {/* ── Active Task View ── */}
      <div>
        {activeTab === 'chat' && <AgentChatPanel onTriggerAction={(act) => console.log(act)} />}
        {activeTab === 'find_jobs' && <FindMatchingJobsWorkflow />}
        {activeTab === 'match_jd' && <MatchJobDescriptionWorkflow initialJdText={jdTextState} />}
      </div>
    </div>
  )
}

export default function AIAgent() {
  return (
    <ResumeProvider>
      <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-5">
        <AIAgentInner />
      </div>
    </ResumeProvider>
  )
}
