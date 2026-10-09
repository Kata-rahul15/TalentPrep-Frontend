import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Clock,
  Briefcase,
  Mic,
  MessageSquare,
  Award,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'

interface Track {
  id: string
  title: string
  category: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  questionsCount: number
  skills: string[]
}

const TRACKS: Track[] = [
  {
    id: 'behavioral-star',
    title: 'Behavioral & Leadership (STAR Method)',
    category: 'Leadership & HR',
    duration: '20 mins',
    difficulty: 'Intermediate',
    description: 'Master situational questions, conflict resolution, project leadership, and behavioral scenarios using the STAR framework.',
    questionsCount: 5,
    skills: ['Communication', 'Leadership', 'Conflict Resolution', 'Adaptability'],
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Web Architecture',
    category: 'Technical Engineering',
    duration: '30 mins',
    difficulty: 'Advanced',
    description: 'Deep dive into REST/GraphQL APIs, microservices, state management, caching, database indexing, and async queues.',
    questionsCount: 6,
    skills: ['React/Next.js', 'Spring Boot/Node', 'SQL & Redis', 'System Design'],
  },
  {
    id: 'frontend-engineering',
    title: 'Modern Frontend & Web Performance',
    category: 'Technical Engineering',
    duration: '25 mins',
    difficulty: 'Intermediate',
    description: 'Covers JavaScript internals, React rendering cycles, Web Vitals, accessibility (a11y), and CSS architectures.',
    questionsCount: 5,
    skills: ['JavaScript / TypeScript', 'React Hooks', 'DOM & Performance', 'CSS'],
  },
  {
    id: 'system-design',
    title: 'System Design & Scalability',
    category: 'Technical Engineering',
    duration: '35 mins',
    difficulty: 'Advanced',
    description: 'Architecting high-throughput, low-latency distributed systems with fault-tolerance, load balancers, and CDN caching.',
    questionsCount: 4,
    skills: ['Distributed Systems', 'Scalability', 'CAP Theorem', 'Sharding'],
  },
]

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  'behavioral-star': [
    'Tell me about a time when you had a disagreement with a technical lead or product manager. How did you resolve it?',
    'Describe a high-priority production issue you encountered. What steps did you take under pressure?',
    'Give an example of a project where requirements changed midway. How did you adapt your timeline?',
  ],
  'fullstack-dev': [
    'How do you design an idempotent payment processing API to avoid double charges under network retries?',
    'Explain how JWT authentication works, how refresh tokens should be safely stored, and how revocation is handled.',
    'Compare optimistic vs pessimistic database locking and when you would choose each.',
  ],
  'frontend-engineering': [
    'Explain the React reconciliation algorithm and how React keys prevent unnecessary DOM re-renders.',
    'How would you diagnose and optimize a Web Vitals Largest Contentful Paint (LCP) issue on a complex single page app?',
    'Explain the differences between debounce and throttle with real-world frontend use-cases.',
  ],
  'system-design': [
    'Design a real-time URL shortening service like Bit.ly capable of handling 100M daily writes and 1B reads.',
    'How would you architect a distributed rate limiter that works across multiple geographical regions?',
    'Explain cache stampede prevention strategies in a high-traffic microservice architecture.',
  ],
}

export default function Interview() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [activeSession, setActiveSession] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [userResponse, setUserResponse] = useState('')
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleStartSession = (track: Track) => {
    setSelectedTrack(track)
    setActiveSession(true)
    setCurrentQuestionIdx(0)
    setUserResponse('')
    setSubmittedFeedback(null)
  }

  const handleEvaluateAnswer = () => {
    if (!userResponse.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setSubmittedFeedback(
        'Excellent answer! You clearly structured the situation and highlighted concrete actions. To make this answer even stronger for senior interviewers, consider adding quantifiable business impact metrics (e.g. "reduced latency by 35%" or "saved 10 engineering hours weekly").'
      )
    }, 1200)
  }

  const handleNextQuestion = () => {
    const questions = selectedTrack ? SAMPLE_QUESTIONS[selectedTrack.id] || [] : []
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setUserResponse('')
      setSubmittedFeedback(null)
    } else {
      setSubmittedFeedback('Congratulations! You have completed all sample questions for this track. Review your feedback above.')
    }
  }

  const handleExitSession = () => {
    setActiveSession(false)
    setSelectedTrack(null)
    setUserResponse('')
    setSubmittedFeedback(null)
  }

  return (
    <div className="flex-1 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Workspace Header */}
      <div>
        <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold uppercase tracking-wider mb-0.5">
          <Video className="w-3.5 h-3.5" />
          <span>Interactive Interview Workspace</span>
        </div>
        <h1 className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white tracking-tight leading-tight">
          AI Interview Simulator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl leading-tight">
          Practice technical, behavioral, and architectural interview questions with realistic simulations and intelligent response critique.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!activeSession ? (
          /* ── Track Selection View ── */
          <motion.div
            key="track-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {/* Quick Stats banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">Available Tracks</p>
                  <p className="text-sm font-bold text-foreground font-heading leading-tight mt-0.5">4 Core Domains</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">Feedback Engine</p>
                  <p className="text-sm font-bold text-foreground font-heading leading-tight mt-0.5">STAR & Tech Rubrics</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">Scoring Standard</p>
                  <p className="text-sm font-bold text-foreground font-heading leading-tight mt-0.5">FAANG & Tier-1 Ready</p>
                </div>
              </div>
            </div>

            {/* Tracks List */}
            <div className="space-y-2.5">
              <h2 className="font-heading font-bold text-sm sm:text-base text-foreground">Select an Interview Track</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {TRACKS.map((track) => (
                  <div
                    key={track.id}
                    className="bg-card border border-border hover:border-primary/40 rounded-xl p-4 transition-all flex flex-col justify-between hover:shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.2 rounded">
                          {track.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{track.duration}</span>
                        </div>
                      </div>

                      <h3 className="font-heading font-bold text-sm text-foreground mt-0.5 leading-tight">
                        {track.title}
                      </h3>

                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {track.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {track.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.2 bg-muted rounded text-foreground font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3.5 mt-2 border-t border-border flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {track.questionsCount} practice prompts
                      </span>
                      <button
                        onClick={() => handleStartSession(track)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-2xs h-7.5"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Launch Simulation</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Active Simulation Session ── */
          <motion.div
            key="active-session"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleExitSession}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Tracks</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{selectedTrack?.title}</span>
                <span>•</span>
                <span>Q{currentQuestionIdx + 1} of {selectedTrack ? SAMPLE_QUESTIONS[selectedTrack.id]?.length || 1 : 1}</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Interview Prompt</span>
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-foreground leading-relaxed">
                {selectedTrack && SAMPLE_QUESTIONS[selectedTrack.id]?.[currentQuestionIdx]}
              </h3>

              <div className="pt-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Your Answer (Type your structured response or notes below):
                </label>
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Outline your approach, scenario context, specific actions taken, and the quantified result..."
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg p-3 text-xs sm:text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Speech-to-text active</span>
                </div>

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={!userResponse.trim() || isAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary-hover disabled:bg-secondary-bg disabled:text-muted-foreground disabled:border disabled:border-border disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg shadow-2xs transition-all cursor-pointer h-8"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Evaluate with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Feedback Card */}
            {submittedFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Feedback & Recommendations</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {submittedFeedback}
                </p>

                <div className="pt-1.5 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-background font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity cursor-pointer h-7.5"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
