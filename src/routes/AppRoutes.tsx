import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import VerifyOtp from '@/pages/VerifyOtp'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Home from '@/pages/Home'
import { AuthProvider, useAuth } from '@/services/authService'

// Resume module
import ResumeLayout from '@/features/resume/components/ResumeLayout'
import ResumeDashboard from '@/features/resume/pages/ResumeDashboard'
import ResumeUpload from '@/features/resume/pages/ResumeUpload'
import ResumeDetails from '@/features/resume/pages/ResumeDetails'
import ResumeEvaluation from '@/features/resume/pages/ResumeEvaluation'
import JobMatch from '@/features/resume/pages/JobMatch'
import ResumeChat from '@/features/resume/pages/ResumeChat'

// Guard for authenticated screens
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Guard for guest-only screens (Login, Signup, etc.)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/home" replace />
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

          {/* Authentication Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Dashboard/Home Route */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

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

          {/* Fallback to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
