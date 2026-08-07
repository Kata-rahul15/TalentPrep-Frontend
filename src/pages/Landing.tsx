import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Trust from '@/components/sections/Trust'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import Benefits from '@/components/sections/Benefits'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/layout/Footer'
import OAuthCallback from '@/pages/OAuthCallback'

export default function Landing() {
  const isOAuthReturn =
    typeof window !== 'undefined' &&
    (sessionStorage.getItem('oauth_pending') === 'true' ||
     window.location.search.includes('oauth') ||
     window.location.search.includes('code='))

  if (isOAuthReturn) {
    return <OAuthCallback />
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Sticky Top Navigation Bar */}
      <Navbar />
      
      {/* Main Sections */}
      <main>
        <Hero />
        <Trust />
        <Features />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      
      {/* Bottom Footer Column Block */}
      <Footer />
    </div>
  )
}
