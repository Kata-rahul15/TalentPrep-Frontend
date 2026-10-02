import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How does AI interview simulation work?',
      answer:
        'Our platform uses advanced language models to generate contextual questions based on your target role. The AI acts as a real interviewer, speaking live to you, listening to your spoken answers, and adapting its follow-up questions in real-time to simulate a authentic conversation.',
    },
    {
      question: 'Is technical interview practice included?',
      answer:
        'Yes! We support multiple technical paths, including live coding sandboxes, database query builders, algorithm questions, and system design challenges, complete with automated complexity and architectural feedback.',
    },
    {
      question: 'Can beginners use TalentPrep?',
      answer:
        'Absolutely. We have preparation paths tailored for all experience levels, from entry-level graduates to staff engineers. You can adjust the difficulty of the AI\'s questions and pacing at any time to match your goals.',
    },
    {
      question: 'How is feedback generated?',
      answer:
        'Upon completing a session, our AI analyzes the transcript of your responses, checking for vocal clarity, filler word counts, sentiment tone, and adherence to structural frameworks like the STAR method. You get a complete scorecard with action items.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, we take security very seriously. All interview audio and transcripts are encrypted, and we never share your data, credentials, or profile information with third-party employers without your direct permission.',
    },
  ]

  const toggleAccordion = (idx: number) => {
    if (activeIndex === idx) {
      setActiveIndex(null)
    } else {
      setActiveIndex(idx)
    }
  }

  return (
    <section id="faq" className="py-14 sm:py-16 md:py-20 bg-secondary-bg/30 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Support & Assistance</p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-secondary-foreground text-sm sm:text-base">
            Can’t find what you're looking for? Reach out to our customer support.
          </p>
        </div>

        {/* Accordions List */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isActive = activeIndex === idx
            return (
              <div
                key={idx}
                className={`bg-card rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-primary shadow-sm'
                    : 'border-border shadow-sm hover:border-border'
                }`}
              >
                {/* Header Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-semibold text-foreground focus:outline-none"
                  aria-expanded={isActive}
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary-bg border-border text-muted-foreground'
                  }`}>
                    {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Body Content */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-divider pt-4">
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
