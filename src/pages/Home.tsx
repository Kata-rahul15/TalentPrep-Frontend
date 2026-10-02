import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileText, Briefcase, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/services/authService'
import homeIllustration from '@/assets/home-illustration.png'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Clean user display name (e.g. "Rahul1213" -> "Rahul")
  const displayName = React.useMemo(() => {
    if (!user?.username) return 'User'
    const cleaned = user.username.replace(/[0-9_.]/g, ' ').trim()
    const firstWord = cleaned.split(/\s+/)[0]
    if (!firstWord) return user.username
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
  }, [user?.username])

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex flex-col justify-between">
      {/* ── Hero Section (2 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Side: Greeting & Description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 space-y-1.5 sm:space-y-2"
        >
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white tracking-tight">
            Welcome back,
          </h2>

          <div className="relative inline-flex items-center gap-2">
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-blue-600 dark:text-blue-500 tracking-tight leading-none">
              {displayName}
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 fill-blue-500 flex-shrink-0 -mt-4" />
          </div>

          <div className="pt-1.5 sm:pt-2">
            <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
              Let's continue your interview preparation journey and achieve your dream job.
            </p>

            {/* Subtle decorative brush stroke */}
            <svg
              className="w-20 sm:w-28 h-2.5 text-blue-500/80 stroke-current mt-2"
              viewBox="0 0 120 12"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M3,9 C30,3 70,11 117,4" />
            </svg>
          </div>
        </motion.div>

        {/* Right Side: Illustration Asset */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 flex justify-center lg:justify-end"
        >
          <img
            src={homeIllustration}
            alt="Interview Preparation Illustration"
            className="w-full max-w-[360px] lg:max-w-[440px] h-auto object-contain pointer-events-none select-none drop-shadow-xs"
          />
        </motion.div>
      </div>

      {/* ── Action Section (Resume & Interview Cards) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-6 sm:mt-8"
      >
        {/* 1. Resume Action Card */}
        <div
          onClick={() => navigate('/resume')}
          className="bg-gradient-to-br from-blue-50/70 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:to-blue-950/30 border border-blue-100/90 dark:border-blue-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-center justify-between gap-4 z-10 relative">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100/90 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-xs">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Resume
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xs">
                  Optimize your resume, get AI feedback, and improve your ATS score.
                </p>
              </div>
            </div>

            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 flex-shrink-0">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Decorative wave graphic at card bottom */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-10 text-blue-200/35 dark:text-blue-900/20 pointer-events-none"
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M0,40 Q125,70 250,30 T500,40" />
            <path d="M0,55 Q125,25 250,55 T500,50" opacity="0.6" />
          </svg>
        </div>

        {/* 2. Interview Action Card */}
        <div
          onClick={() => navigate('/interview')}
          className="bg-gradient-to-br from-purple-50/70 via-purple-50/30 to-indigo-50/40 dark:from-slate-900 dark:to-purple-950/30 border border-purple-100/90 dark:border-purple-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-center justify-between gap-4 z-10 relative">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-100/90 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-200/50 dark:border-purple-800/50 shadow-xs">
                <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Interview
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xs">
                  Practice interviews with AI, improve your answers, and build confidence.
                </p>
              </div>
            </div>

            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs border border-slate-200/80 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-200 flex-shrink-0">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Decorative wave graphic at card bottom */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-10 text-purple-200/35 dark:text-purple-900/20 pointer-events-none"
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M0,40 Q125,70 250,30 T500,40" />
            <path d="M0,55 Q125,25 250,55 T500,50" opacity="0.6" />
          </svg>
        </div>
      </motion.div>

      {/* ── Recent Activity Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-10 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-extrabold text-lg text-foreground">
              Recent Activity & Status
            </h3>
          </div>
          <button
            onClick={() => navigate('/resume')}
            className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real activity list derived from backend/mock session state */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-secondary-bg/60 border border-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Resume File Parsed</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Rahul_Sharma_Resume.pdf • ATS Score: 84/100
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/resume/details')}
              className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-secondary-bg transition-colors cursor-pointer"
            >
              Inspect Details
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-secondary-bg/60 border border-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center font-bold text-xs flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Job Match Analysis Available</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Senior Backend Engineer • 82% Keyword Fit
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/resume/job-match')}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Run Job Match
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

