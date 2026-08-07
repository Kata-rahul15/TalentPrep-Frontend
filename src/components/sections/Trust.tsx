import { PlayCircle, Users, Award, MessageSquareCode } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Trust() {
  const stats = [
    {
      id: 1,
      number: '50,000+',
      label: 'Practice Sessions Completed',
      desc: 'Simulations across multiple domains and technologies.',
      icon: PlayCircle,
      color: 'text-primary bg-primary/5 border-primary/20',
    },
    {
      id: 2,
      number: '95%',
      label: 'User Satisfaction',
      desc: 'Graduates reported feeling significantly more prepared.',
      icon: Users,
      color: 'text-primary bg-primary/5 border-primary/20',
    },
    {
      id: 3,
      number: '1,000+',
      label: 'Interview Questions',
      desc: 'Expert-curated behavioral, HR, and coding questions.',
      icon: Award,
      color: 'text-primary bg-primary/5 border-primary/20',
    },
    {
      id: 4,
      number: 'Real-Time',
      label: 'AI Feedback Engine',
      desc: 'Instant scoring, audio analysis, and response coaching.',
      icon: MessageSquareCode,
      color: 'text-success bg-success/5 border-success/20',
    },
  ]

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtitle / Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Proven Results</p>
          <h2 className="font-heading font-extrabold text-3xl text-foreground tracking-tight">
            Trusted by Job Seekers Worldwide
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-border transition-all flex flex-col items-center text-center gap-4 group"
              >
                {/* Icon Wrapper */}
                <div className={`p-3.5 rounded-xl border flex items-center justify-center transition-colors ${stat.color} group-hover:scale-110 duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Stats Info */}
                <div>
                  <h3 className="font-heading font-black text-3xl text-foreground tracking-tight mb-1">
                    {stat.number}
                  </h3>
                  <h4 className="font-semibold text-sm text-secondary-foreground mb-2">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stat.desc}
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
