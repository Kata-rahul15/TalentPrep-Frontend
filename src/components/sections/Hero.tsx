import { useRef } from 'react'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import TrustedCompanies from './TrustedCompanies'

/* ─────────────────────────────────────────────
   Parallax helper – maps cursor position to
   a small spring-based offset for each layer.
   ───────────────────────────────────────────── */
function useParallax(strength: number) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 120, damping: 25, mass: 0.5 }
  const sx = useSpring(x, springConfig)
  const sy = useSpring(y, springConfig)

  const handleMove = (clientX: number, clientY: number, rect: DOMRect) => {
    const nx = (clientX - rect.left) / rect.width - 0.5
    const ny = (clientY - rect.top) / rect.height - 0.5
    x.set(nx * strength)
    y.set(ny * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  return { sx, sy, handleMove, reset }
}

/* ─────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────── */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  const bgLayer    = useParallax(4)
  const imageLayer = useParallax(10)

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    bgLayer.handleMove(e.clientX, e.clientY, rect)
    imageLayer.handleMove(e.clientX, e.clientY, rect)
  }

  const onMouseLeave = () => {
    bgLayer.reset()
    imageLayer.reset()
  }

  /* animation variants */
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 18 } },
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-background"
    >
      {/* ── Ambient blurs (parallax bg layer) ── */}
      <motion.div
        style={{ x: bgLayer.sx, y: bgLayer.sy }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full bg-primary/5 filter blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[100px]" />
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-28 md:py-32 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center min-h-[80vh]">

          {/* ════════════════════════════════════════
              LEFT COLUMN – Copy
              ════════════════════════════════════════ */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-5 text-left relative z-20 pt-8 sm:pt-12 lg:pt-28 lg:self-start pb-8 lg:pb-0"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-heading font-black text-[2.2rem] sm:text-[2.6rem] lg:text-[2.85rem] tracking-[-0.02em] text-foreground leading-[1.1]"
            >
              Master Every{' '}
              <br className="hidden sm:block" />
              Interview with{' '}
              <br className="hidden lg:block" />
              <span className="gradient-text">AI-Powered Practice</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-[15px] text-muted-foreground leading-[1.7] max-w-[25rem]"
            >
              Prepare for technical, behavioral, and HR interviews through
              realistic AI simulations, instant feedback, and personalized
              improvement insights.
            </motion.p>

            {/* Single CTA */}
            <motion.div variants={fadeUp} className="mt-1">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                Try Now for Free
              </Link>
            </motion.div>

            {/* Trusted row */}
            <TrustedCompanies />
          </motion.div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN – Seamless Image Only
              ════════════════════════════════════════ */}
          <div className="lg:col-span-7 relative flex items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[680px] lg:max-w-none">

              {/* ── The Interview Scene Image ── */}
              <motion.div
                style={{ x: imageLayer.sx, y: imageLayer.sy }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative hero-image-blend hero-image-blend-bottom hero-image-blend-top"
              >
                <img
                  src="/hero-interview.png"
                  alt="AI-powered interview preparation – candidate sitting with AI robot interviewer"
                  className="w-full h-auto object-cover select-none pointer-events-none"
                  style={{ minHeight: '420px', maxHeight: '640px', objectPosition: 'center 15%' }}
                  draggable={false}
                />
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
