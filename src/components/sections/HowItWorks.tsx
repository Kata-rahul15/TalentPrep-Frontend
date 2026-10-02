import { Upload, Bot, TrendingUp } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    num: 1,
    title: 'Upload & Analyze Your Resume',
    desc: 'Drop your PDF or DOCX. TalentPrep parses every section and delivers an instant ATS evaluation — keyword coverage, formatting quality, and actionable improvement tips.',
    Icon: Upload,
    circleClass: 'bg-primary text-white shadow-[0_2px_14px_rgba(37,99,235,0.30)]',
    iconClass:   'bg-primary/10 text-primary border border-primary/20',
  },
  {
    num: 2,
    title: 'Match Jobs & Practice with AI',
    desc: 'Paste any job description for a precise match score. Then enter the AI interview room — choose your track (technical, HR, or behavioral) and practice with context-aware follow-up questions.',
    Icon: Bot,
    circleClass: 'bg-info text-white shadow-[0_2px_14px_rgba(14,165,233,0.30)]',
    iconClass:   'bg-info/10 text-info border border-info/20',
  },
  {
    num: 3,
    title: 'Receive Feedback & Improve',
    desc: 'Get performance metrics right after each session: STAR compliance, speech pace, filler words, and high-scoring alternative answers. Track your ATS score over time and arrive at every interview confident.',
    Icon: TrendingUp,
    circleClass: 'bg-success text-white shadow-[0_2px_14px_rgba(22,163,74,0.30)]',
    iconClass:   'bg-success/10 text-success border border-success/20',
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="how-it-works"
      className="py-14 sm:py-16 md:py-20 bg-secondary-bg scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight leading-tight mb-3">
            How TalentPrep Works
          </h2>
          <p className="text-secondary-foreground text-sm sm:text-base leading-relaxed">
            From resume upload to offer-ready in three focused steps. Practice
            regularly to cut interview anxiety and master every question type.
          </p>
        </div>

        {/* ── Timeline ───────────────────────────────────── */}
        <div ref={ref}>

          {/* ── DESKTOP: horizontal connected rail ──────── */}
          <div className="hidden lg:block">

            {/* Circle rail — circles centered over content columns below */}
            <div className="relative flex justify-between items-center px-[calc(100%/6)] mb-8">

              {/* Connector line — spans from circle 1 to circle 3 */}
              <div
                className="absolute inset-y-1/2 -translate-y-1/2 h-px bg-border overflow-hidden"
                style={{ left: 'calc(100% / 6)', right: 'calc(100% / 6)' }}
              >
                <motion.div
                  className="h-full bg-primary/30"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  style={{ transformOrigin: '0% 50%' }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.55 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    type: 'spring',
                    stiffness: 140,
                    damping: 14,
                    delay: i * 0.22,
                  }}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-heading font-black text-lg flex-shrink-0 ${step.circleClass}`}
                >
                  {step.num}
                </motion.div>
              ))}
            </div>

            {/* Content cards — 3-col grid aligned under circles */}
            <div className="grid grid-cols-3 gap-5">
              {steps.map((step, i) => {
                const Icon = step.Icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.18 + 0.42,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/25 hover:shadow-md transition-all duration-300"
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${step.iconClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Heading */}
                    <h3 className="font-heading font-extrabold text-[1.05rem] text-foreground leading-snug">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ── MOBILE / TABLET: vertical connected timeline ── */}
          <div className="lg:hidden flex flex-col">
            {steps.map((step, i) => {
              const Icon = step.Icon
              return (
                <motion.div
                  key={`m-${i}`}
                  initial={{ opacity: 0, x: -14 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex gap-5"
                >
                  {/* Left: circle + vertical line */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-heading font-black text-base flex-shrink-0 ${step.circleClass}`}
                    >
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <motion.div
                        className="w-px flex-1 bg-border mt-2 min-h-[48px]"
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        style={{ transformOrigin: '50% 0%' }}
                        transition={{
                          duration: 0.45,
                          delay: i * 0.14 + 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    )}
                  </div>

                  {/* Right: content */}
                  <div
                    className={`flex-1 flex flex-col gap-3 ${
                      i < steps.length - 1 ? 'pb-8' : 'pb-0'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${step.iconClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-extrabold text-[1.05rem] text-foreground leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
