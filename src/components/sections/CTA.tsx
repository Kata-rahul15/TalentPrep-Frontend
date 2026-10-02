import { ArrowRight, Sparkles, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section id="cta" className="py-12 sm:py-16 bg-background relative overflow-hidden">
      {/* Background visual shape */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-slate-950 border border-slate-900 text-white p-6 sm:p-10 md:p-12 text-center overflow-hidden shadow-lg">
          
          {/* Subtle low-opacity blurs inside banner */}
          <div className="absolute top-[-30%] left-[-10%] w-72 h-72 bg-white/[0.02] rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-30%] right-[-10%] w-72 h-72 bg-primary/5 rounded-full filter blur-2xl pointer-events-none" />

          {/* Sparkles icon */}
          <div className="mx-auto w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3 leading-tight">
            Start Preparing Smarter Today
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            Join thousands of successful professionals who used TalentPrep to refine their skills, gain confidence, and land their job offers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Try TalentPrep Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button 
              onClick={() => {
                const faqElement = document.querySelector('#faq')
                faqElement?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
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
