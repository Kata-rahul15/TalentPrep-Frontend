import { ArrowRight, Sparkles, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-background relative overflow-hidden">
      {/* Background visual shape */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-slate-950 border border-slate-900 text-white p-8 md:p-16 text-center overflow-hidden shadow-lg">
          
          {/* Subtle low-opacity blurs inside banner */}
          <div className="absolute top-[-30%] left-[-10%] w-72 h-72 bg-white/[0.02] rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-30%] right-[-10%] w-72 h-72 bg-primary/5 rounded-full filter blur-2xl pointer-events-none" />

          {/* Sparkles icon */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl tracking-tight mb-4 leading-tight">
            Start Preparing Smarter Today
          </h2>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of successful professionals who used TalentPrep to refine their skills, gain confidence, and land their job offers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Try TalentPrep Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button 
              onClick={() => {
                const faqElement = document.querySelector('#faq')
                faqElement?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Have Questions? Read FAQ
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center gap-2 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4" />
            <span>No credit card required. Free tier includes 2 full sessions.</span>
          </div>

        </div>
      </div>
    </section>
  )
}
