import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Trust from '@/components/sections/Trust'
import HowItWorks from '@/components/sections/HowItWorks'
import ResumeIntelligence from '@/components/sections/ResumeIntelligence'
import JobSearchSection from '@/components/sections/JobSearchSection'
import AIAgentSection from '@/components/sections/AIAgentSection'
import ResumeBuilderSection from '@/components/sections/ResumeBuilderSection'
import ProductFlow from '@/components/sections/ProductFlow'
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
      
      {/* Main Landing Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero />
        
        {/* 2. Architecture & Trust Pillars */}
        <Trust />
        
        {/* 3. Product Journey: Understand -> Discover -> Act */}
        <HowItWorks />
        
        {/* 4. Deep Dive: Resume Intelligence */}
        <ResumeIntelligence />
        
        {/* 5. Core Feature: AI Job Search */}
        <JobSearchSection />
        
        {/* 6. Core Feature: AI Career Agent */}
        <AIAgentSection />
        
        {/* 7. Core Feature: Resume Builder Studio */}
        <ResumeBuilderSection />
        
        {/* 8. End-to-End Product Flow */}
        <ProductFlow />
        
        {/* 9. Comprehensive Product FAQ */}
        <FAQ />
        
        {/* 10. Call to Action Banner */}
        <CTA />
      </main>
      
      {/* Footer Block */}
      <Footer />
    </div>
  )
}
