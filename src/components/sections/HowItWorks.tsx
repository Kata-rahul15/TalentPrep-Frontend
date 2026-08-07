import { Sliders, Play, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Choose Interview Type',
      subtitle: 'Customize Your Practice',
      desc: 'Select from front-end, back-end, HR screening, or behavioral interview tracks. Enter details about your targeted job role to generate contextual questions.',
      icon: Sliders,
      bgClass: 'bg-primary/5 text-primary border-primary/20',
    },
    {
      step: '02',
      title: 'Practice with AI Interviewer',
      subtitle: 'Simulate the Environment',
      desc: 'Engage with our interactive AI coach. Respond verbally using your mic or type answers. The AI will ask follow-up questions depending on your inputs.',
      icon: Play,
      bgClass: 'bg-primary/5 text-primary border-primary/20',
    },
    {
      step: '03',
      title: 'Receive Detailed Feedback',
      subtitle: 'Review & Improve',
      desc: 'Get immediate performance metrics. Review speech pace, fillers, STAR method compliance, and see alternative, high-scoring answer suggestions.',
      icon: Award,
      bgClass: 'bg-success/5 text-success border-success/20',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Platform Flow</p>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight mb-4">
            How TalentPrep Works
          </h2>
          <p className="text-secondary-foreground text-base sm:text-lg leading-relaxed">
            Get interview-ready in three straightforward steps. Practice regularly to reduce performance anxiety and master difficult questions.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[28%] left-[10%] right-[10%] border-t border-dashed border-border -z-10" />

          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative bg-card rounded-3xl border border-border p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-6 group hover:border-primary/20"
              >
                {/* Step badge */}
                <span className="absolute top-4 right-6 font-heading font-extrabold text-4xl text-secondary-bg group-hover:text-primary/10 transition-colors">
                  {item.step}
                </span>

                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-300 ${item.bgClass} group-hover:scale-110 group-hover:shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Texts */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    {item.subtitle}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
