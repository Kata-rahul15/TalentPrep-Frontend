import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, CheckCircle2, Star, Zap } from 'lucide-react'

/* ─────────────────────────────────────────────
   Score Ring SVG — ATS score gauge
   ───────────────────────────────────────────── */
function ScoreRingSVG({ score = 84 }: { score?: number }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color =
    score >= 75 ? '#16A34A' : score >= 50 ? '#F59E0B' : '#DC2626'

  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      aria-label={`ATS Score ${score}`}
      className="block"
    >
      {/* Track */}
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        className="text-border"
      />
      {/* Fill */}
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s' }}
      />
      {/* Label */}
      <text
        x="48"
        y="44"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18"
        fontWeight="800"
        fill={color}
        fontFamily="Outfit, system-ui, sans-serif"
      >
        {score}
      </text>
      <text
        x="48"
        y="60"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8.5"
        fontWeight="600"
        fill="currentColor"
        className="text-muted-foreground"
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        ATS Score
      </text>
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Score Bar row
   ───────────────────────────────────────────── */
function ScoreBar({
  label,
  value,
  delay = '0s',
}: {
  label: string
  value: number
  delay?: string
}) {
  const color =
    value >= 75 ? 'bg-success' : value >= 50 ? 'bg-warning' : 'bg-danger'

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-muted-foreground w-24 flex-shrink-0 leading-none">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full animate-score-bar ${color}`}
          style={
            {
              '--bar-target': `${value}%`,
              '--bar-delay': delay,
            } as React.CSSProperties
          }
        />
      </div>
      <span className="text-[10px] font-bold text-foreground w-7 text-right flex-shrink-0">
        {value}%
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Dashboard Preview MockupF
   ───────────────────────────────────────────── */
function DashboardPreview() {
  return (
    <div
      className="relative w-full max-w-[520px] mx-auto lg:mx-0"
      aria-hidden="true"
    >
      {/* Ambient glow behind card */}
      <div className="absolute -inset-8 rounded-3xl bg-primary/10 dark:bg-primary/15 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div
        className="relative rounded-2xl border border-border bg-card shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12),_0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),_0_8px_24px_-4px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        {/* Window chrome bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary-bg">
          <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
          <span className="ml-3 text-[11px] font-semibold text-muted-foreground tracking-wide">
            TalentPrep — Resume Evaluation
          </span>
        </div>

        {/* Card body */}
        <div className="p-5 sm:p-6">
          {/* Top row: score ring + score bars */}
          <div className="flex items-start gap-5 sm:gap-6">
            {/* Score ring */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <ScoreRingSVG score={84} />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                ↑ +12 this week
              </span>
            </div>

            {/* Score bars */}
            <div className="flex-1 flex flex-col gap-2.5 pt-1">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Breakdown
              </p>
              <ScoreBar label="Keyword Match" value={90} delay="0.55s" />
              <ScoreBar label="Technical Skills" value={85} delay="0.65s" />
              <ScoreBar label="Formatting" value={78} delay="0.75s" />
              <ScoreBar label="Experience" value={72} delay="0.85s" />
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-divider" />

          {/* Suggestion chips */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
              AI Suggestions
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Add Docker & Kubernetes to Skills', priority: 'High' },
                { label: 'Quantify impact at Infosys with metrics', priority: 'Medium' },
              ].map(({ label, priority }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-secondary-bg border border-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Zap className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="text-[11px] font-medium text-foreground truncate">
                      {label}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${priority === 'High'
                        ? 'bg-danger/10 text-danger border border-danger/20'
                        : 'bg-warning/10 text-warning border border-warning/20'
                      }`}
                  >
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stat strip */}
          <div className="mt-4 flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-primary">Job Match: 82%</span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">Senior Java Engineer · Infosys</span>
          </div>
        </div>
      </div>

      {/* Floating notification badge */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5, type: 'spring', stiffness: 120, damping: 18 }}
        className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-bold text-foreground">Resume Analyzed</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">Score improved by 12pts</span>
        </div>
      </motion.div>

      {/* Floating "ATS Ready" pill */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.45, type: 'spring', stiffness: 100, damping: 20 }}
        className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success text-white text-[11px] font-bold shadow-[0_4px_12px_rgba(22,163,74,0.35)]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
        ATS Ready
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Hero Section — Main Export
   ───────────────────────────────────────────── */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 18 },
    },
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 70, damping: 16, delay: 0.25 },
    },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-background"
      aria-label="Hero"
    >
      {/* ── Background field ──────────────────────────── */}
      {/* Top-center radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Large ambient bloom */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[140px]" />
        {/* Right-side depth accent */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-info/6 dark:bg-info/8 rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-20">

          {/* ── LEFT: Editorial column ─────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex-1 max-w-xl lg:max-w-none text-center lg:text-left"
          >
            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-heading font-black text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4rem] tracking-tight text-foreground leading-[1.08] sm:leading-[1.1]"
            >
              Land Your Dream Job —
              <br className="hidden sm:block" />
              <span className="text-primary"> Starting With</span>
              <br className="hidden sm:block" />
              Your Resume.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg md:text-xl text-secondary-foreground leading-relaxed max-w-[52ch] mx-auto lg:mx-0"
            >
              Analyze your resume with AI, match it to any job description, and
              practice realistic interviews — all in one focused platform built
              for engineers and professionals.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <Link
                to="/signup"
                id="hero-cta-primary"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-semibold text-base rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer w-full sm:w-auto justify-center"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#how-it-works"
                id="hero-cta-secondary"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-secondary-foreground hover:text-foreground font-semibold text-base rounded-xl border border-border hover:border-primary/30 hover:bg-secondary-bg transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center"
              >
                <ChevronDown className="w-4 h-4" />
                <span>See How It Works</span>
              </a>
            </motion.div>

            {/* Trust micro-proof */}
            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5"
            >
              {[
                'No credit card required',
                'Free to get started',
                'Built for engineers',
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center gap-4 justify-center lg:justify-start"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-2.5">
                {[
                  { initials: 'RS', bg: 'bg-primary/15 text-primary' },
                  { initials: 'AK', bg: 'bg-success/15 text-success' },
                  { initials: 'PV', bg: 'bg-warning/15 text-warning' },
                  { initials: 'MN', bg: 'bg-info/15 text-info' },
                ].map(({ initials, bg }) => (
                  <div
                    key={initials}
                    className={`w-8 h-8 rounded-full ring-2 ring-background flex items-center justify-center font-bold text-[10px] uppercase ${bg}`}
                  >
                    {initials}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full ring-2 ring-background bg-secondary-bg border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                  +1k
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground mt-1">
                  Trusted by <strong className="text-foreground font-bold">10,000+</strong> job seekers
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Dashboard panel ─────────────────── */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-14 lg:mt-0 flex-1 flex items-center justify-center lg:justify-end animate-float-gentle"
          >
            <DashboardPreview />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
