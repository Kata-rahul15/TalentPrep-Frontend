import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import VerifyOtp from '@/pages/VerifyOtp'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Home from '@/pages/Home'
import Interview from '@/pages/Interview'
import Profile from '@/pages/Profile'
import { AuthProvider, useAuth } from '@/services/authService'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout'

// Resume module
import ResumeLayout from '@/features/resume/components/ResumeLayout'
import ResumeDashboard from '@/features/resume/pages/ResumeDashboard'
import ResumeUpload from '@/features/resume/pages/ResumeUpload'
import ResumeDetails from '@/features/resume/pages/ResumeDetails'
import ResumeEvaluation from '@/features/resume/pages/ResumeEvaluation'
import JobMatch from '@/features/resume/pages/JobMatch'
import ResumeChat from '@/features/resume/pages/ResumeChat'

import OAuthCallback from '@/pages/OAuthCallback'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsAndConditions from '@/pages/TermsAndConditions'
import HelpCenter from '@/pages/HelpCenter'
import NotFound from '@/pages/NotFound'
import { useServiceReadiness } from '@/hooks/useServiceReadiness'
import ServiceWakeupScreen from '@/components/ServiceWakeupScreen'

// Guard for authenticated screens
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  console.log(`[RouteGuard:ProtectedRoute] loading=${loading}, user=${user ? user.email || user.username : 'null'}`)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    console.log('[RouteGuard:ProtectedRoute] Unauthenticated access to protected route. Redirecting to /login...')
    return <Navigate to="/login" replace />
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

// Guard for guest-only screens (Login, Signup, etc.)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  console.log(`[RouteGuard:PublicRoute] loading=${loading}, user=${user ? user.email || user.username : 'null'}`)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    console.log('[RouteGuard:PublicRoute] Authenticated user on guest route. Redirecting to /home...')
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

// Service readiness guard for authentication entry routes
function ReadinessAuthGuard({ children }: { children: React.ReactNode }) {
  const readiness = useServiceReadiness(true)

  if (!readiness.isReady) {
    return (
      <ServiceWakeupScreen
        gatewayStatus={readiness.gatewayStatus}
        authStatus={readiness.authStatus}
        resumeStatus={readiness.resumeStatus}
        dynamicMessage={readiness.dynamicMessage}
        isTimedOut={readiness.isTimedOut}
        isFailed={readiness.isFailed}
        elapsedSeconds={readiness.elapsedSeconds}
        onRetry={readiness.retry}
      />
    )
  }

  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<Landing />} />

          {/* Authentication Routes with Service Wakeup Guard */}
          <Route path="/login" element={<PublicRoute><ReadinessAuthGuard><Login /></ReadinessAuthGuard></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><ReadinessAuthGuard><Signup /></ReadinessAuthGuard></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><ReadinessAuthGuard><VerifyOtp /></ReadinessAuthGuard></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ReadinessAuthGuard><ForgotPassword /></ReadinessAuthGuard></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ReadinessAuthGuard><ResetPassword /></ReadinessAuthGuard></PublicRoute>} />
          <Route path="/oauth/success" element={<OAuthCallback />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Information & Legal Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<HelpCenter />} />

          {/* Authenticated Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Resume Module Routes */}
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeLayout>
                  <ResumeDashboard />
                </ResumeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/upload"
            element={
              <ProtectedRoute>
                <ResumeLayout>
                  <ResumeUpload />
                </ResumeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/details"
            element={
              <ProtectedRoute>
                <ResumeLayout>
                  <ResumeDetails />
                </ResumeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/evaluation"
            element={
              <ProtectedRoute>
                <ResumeLayout>
                  <ResumeEvaluation />
                </ResumeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/job-match"
            element={
              <ProtectedRoute>
                <ResumeLayout>
                  <JobMatch />
                </ResumeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/chat"
            element={
              <ProtectedRoute>
                <ResumeLayout>
                  <ResumeChat />
                </ResumeLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Custom 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
