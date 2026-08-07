import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AnimatePresence } from 'framer-motion'
import Toast from '@/components/layout/Toast'
import { API } from '@/config/api'

// Centralized API client pointing to Spring Boot backend
export const api = axios.create({
  baseURL: API.AUTH_BASE_URL,
  withCredentials: true, // Crucial for sending HttpOnly JWT cookie
})

// Setup Axios response interceptor for automatic logout on unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('tf_user')
      window.dispatchEvent(new Event('auth-unauthorized'))
    }
    return Promise.reject(error)
  }
)

// DTO and Profile Interfaces
export interface UserProfile {
  username: string
  userId: string | number
  email: string
  isAccountVerified: boolean
}

export type LoginOptions =
  | { type: 'local'; email?: string; password?: string; signal?: AbortSignal }
  | { type: 'oauth'; provider?: string; signal?: AbortSignal }

interface AuthContextType {
  user: UserProfile | null
  loginState: (profile: UserProfile) => void
  login: (
    optionsOrEmail: string | LoginOptions,
    passwordParam?: string,
    signalParam?: AbortSignal
  ) => Promise<UserProfile | void>
  logout: () => Promise<void>
  loading: boolean
  getProfile: (signal?: AbortSignal) => Promise<UserProfile>
  fetchProfile: (signal?: AbortSignal) => Promise<UserProfile>
  showToast: (message: string, type: 'success' | 'error') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const navigate = useNavigate()

  // Fetch profile via getProfile() endpoint (used for OAuth flow & initial session restoration)
  const getProfile = async (signal?: AbortSignal) => {
    const response = await getUserProfile(signal)
    const { username, userId, email, isAccountVerified } = response.data
    const profile: UserProfile = { username, userId, email, isAccountVerified }
    setUser(profile)
    localStorage.setItem('tf_user', JSON.stringify(profile))
    return profile
  }

  const fetchProfile = getProfile

  // Initialize state during app load / after OAuth redirect to restore session from backend HTTP-only cookie
  useEffect(() => {
    let active = true
    const initializeAuth = async () => {
      try {
        await getProfile()
      } catch (err: any) {
        if (active) {
          if (err?.response?.status === 404) {
            const storedUser = localStorage.getItem('tf_user')
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser))
              } catch (e) {
                localStorage.removeItem('tf_user')
              }
            }
          } else {
            setUser(null)
            localStorage.removeItem('tf_user')
          }
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    initializeAuth()
    return () => {
      active = false
    }
  }, [])

  // Listen to unauthorized interceptor event
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
    }
    window.addEventListener('auth-unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized)
    }
  }, [])

  const loginState = (profile: UserProfile) => {
    const { username, userId, email, isAccountVerified } = profile
    const userProfile: UserProfile = { username, userId, email, isAccountVerified }
    setUser(userProfile)
    localStorage.setItem('tf_user', JSON.stringify(userProfile))
  }

  // Unified login method: handles LOCAL vs OAuth login flows automatically
  const login = async (
    optionsOrEmail: string | LoginOptions,
    passwordParam?: string,
    signalParam?: AbortSignal
  ) => {
    if (typeof optionsOrEmail === 'object') {
      if (optionsOrEmail.type === 'oauth') {
        // OAuth flow (Google / GitHub): call getProfile() exactly once after OAuth redirect/login
        return await getProfile(optionsOrEmail.signal || signalParam)
      } else {
        // LOCAL login flow: email/password backend response returns user fields directly
        const response = await loginUser(optionsOrEmail.email!, optionsOrEmail.password!, optionsOrEmail.signal || signalParam)
        const { username, userId, email, isAccountVerified } = response.data
        const profile: UserProfile = { username, userId, email, isAccountVerified }
        setUser(profile)
        localStorage.setItem('tf_user', JSON.stringify(profile))
        return profile
      }
    } else {
      // Direct string call: login(email, password, signal) for LOCAL login
      const response = await loginUser(optionsOrEmail, passwordParam!, signalParam)
      const { username, userId, email, isAccountVerified } = response.data
      const profile: UserProfile = { username, userId, email, isAccountVerified }
      setUser(profile)
      localStorage.setItem('tf_user', JSON.stringify(profile))
      return profile
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
      localStorage.removeItem('tf_user')
      setToast({ message: 'Logout successful.', type: 'success' })
      navigate('/')
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return
      }
      const backendMessage = error?.response?.data?.message || (typeof error?.response?.data === 'string' ? error.response.data : null)
      const errorMsg = backendMessage || 'Failed to logout. Please try again.'
      setToast({ message: errorMsg, type: 'error' })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loginState, login, logout, loading, getProfile, fetchProfile, showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// API Contract Endpoints

export const registerUser = (username: string, email: string, password: string, signal?: AbortSignal) => {
  return api.post('/register', { username, email, password }, { signal })
}

export const verifySignupOtp = (email: string, otp: string, signal?: AbortSignal) => {
  return api.post('/send-verify-otp', { email, otp }, { signal })
}

export const resendOtp = (email: string, signal?: AbortSignal) => {
  return api.post('/resend-otp', { email }, { signal })
}

export const loginUser = (email: string, password: string, signal?: AbortSignal) => {
  return api.post('/login', { email, password }, { signal })
}

export const forgotPassword = (email: string, signal?: AbortSignal) => {
  return api.post('/forgot-password', { email }, { signal })
}

export const verifyResetOtp = (email: string, otp: string, signal?: AbortSignal) => {
  return api.post('/send-reset-otp', { email, otp }, { signal })
}

export const resetPassword = (email: string, otp: string, newPassword: string, signal?: AbortSignal) => {
  return api.post('/reset-password', { email, otp, newPassword }, { signal })
}

export const getUserProfile = (signal?: AbortSignal) => {
  return api.get('/profile', { signal })
}

export const getProfile = getUserProfile

export const logoutUser = () => api.post('/logout')

// Reusable standard API error handling utility
export function getErrorMessage(error: any): string {
  if (axios.isCancel(error)) {
    return '' // Cancelled requests don't need UI feedback
  }

  if (error?.response?.data) {
    const data = error.response.data

    // Check for validation / global exception messages from Spring Boot backend
    if (data.message) {
      return data.message
    }

    // Support mapped global exceptions shape { error: true, message: "..." }
    if (data.error === true && data.message) {
      return data.message
    }

    if (typeof data === 'string') {
      return data
    }
  }

  // Handle generic network error (e.g. backend down)
  if (error?.message) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return 'Network connection error. Please verify the Spring Boot backend server is running.'
    }
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

