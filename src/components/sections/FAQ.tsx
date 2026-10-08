import { useState } from 'react'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What is TalentPrep?',
      answer:
        'TalentPrep is an AI-powered career platform designed to help you understand your resume, discover relevant job opportunities based on your actual skills, collaborate with a dedicated AI Career Agent, and craft ATS-ready resumes with a built-in Resume Builder.',
    },
    {
      question: 'How does TalentPrep understand my resume?',
      answer:
        'When you upload your resume (PDF or DOCX), our parsing engine extracts your skills taxonomy, work history, education, and quantified achievements. It evaluates the document against ATS guidelines and creates a structured career profile that powers the rest of the platform.',
    },
    {
      question: 'How does AI Job Search work?',
      answer:
        'AI Job Search matches live tech openings against your extracted profile. Instead of relying solely on exact keyword queries, it calculates skill compatibility scores and lets you filter opportunities by role, location, recency, and work model (Remote, Hybrid, On-site).',
    },
    {
      question: 'What is the AI Career Agent?',
      answer:
        'The AI Career Agent is your dedicated intelligent career assistant. It has visibility into your uploaded resume context and helps you analyze role requirements, suggest bullet point rewrites, identify technical skill gaps, and strategize your next career steps.',
    },
    {
      question: 'Can the AI Career Agent use my resume information?',
      answer:
        'Yes. When your resume is uploaded and parsed, the Career Agent automatically references your experience, skills, and background so its recommendations are tailored specifically to you rather than generic boilerplate advice.',
    },
    {
      question: 'Can I build or improve my resume on TalentPrep?',
      answer:
        'Yes. TalentPrep includes an integrated Resume Builder/Studio where you can edit your sections, review real-time ATS compliance, format your content cleanly, and export print-ready PDF resumes formatted for top tech employers.',
    },
    {
      question: 'Is TalentPrep just a generic job board?',
      answer:
        'No. TalentPrep is an end-to-end career intelligence workspace. While it provides powerful job discovery, it connects your resume analysis, job compatibility scoring, and AI advisory into a unified workflow.',
    },
    {
      question: 'Does TalentPrep automatically apply for jobs on my behalf?',
      answer:
        'No. TalentPrep does not submit automated applications or message recruiters autonomously. Instead, it provides you with deep match scores, skill gap insights, and direct links so you can review and apply with confidence.',
    },
    {
      question: 'Is my resume data and personal information secure?',
      answer:
        'Yes. We take privacy and security seriously. Your resumes, profile details, and agent conversations are securely stored and encrypted. We do not sell or distribute your private career data to third parties.',
    },
    {
      question: 'What features are currently available today?',
      answer:
        'Currently available features include Resume Upload & Parsing, ATS Evaluation Scoring, AI Job Search & Matching, the Context-Aware AI Career Agent, and the full Resume Builder with PDF export.',
    },
  ]

  const toggleAccordion = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-secondary-bg/30 border-t border-border scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Answers to Common Questions
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-secondary-foreground text-base sm:text-lg leading-relaxed">
            Everything you need to know about TalentPrep’s features, career intelligence, and privacy.
          </p>
        </div>

        {/* Accordions List */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isActive = activeIndex === idx
            return (
              <div
                key={idx}
                className={`bg-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isActive
                    ? 'border-primary/50 shadow-xs ring-1 ring-primary/10'
                    : 'border-border shadow-2xs hover:border-border/80'
                }`}
              >
                {/* Header Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 text-left font-heading font-bold text-sm sm:text-base text-foreground focus:outline-none cursor-pointer"
                  aria-expanded={isActive}
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-primary text-white border-primary'
                        : 'bg-secondary-bg border-border text-muted-foreground'
                    }`}
                  >
                    {isActive ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Body Content */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-5 text-sm sm:text-[14.5px] text-secondary-foreground leading-relaxed border-t border-divider pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
