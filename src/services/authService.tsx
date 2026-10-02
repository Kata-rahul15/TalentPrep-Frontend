import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AnimatePresence } from 'framer-motion'
import Toast from '@/components/layout/Toast'
import NetworkStatusToast from '@/components/layout/NetworkStatusToast'
import { API } from '@/config/api'

// Centralized API client pointing to API Gateway backend with credentials enabled
export const api = axios.create({
  baseURL: API.BASE_URL,
  withCredentials: true, // Crucial for sending HttpOnly JWT cookies with all requests
})

// Request Interceptor: Map legacy relative auth endpoints to /api/auth/* routes
api.interceptors.request.use((config) => {
  if (config.url) {
    const legacyAuthEndpoints = [
      '/login',
      '/register',
      '/send-verify-otp',
      '/resend-otp',
      '/forgot-password',
      '/send-reset-otp',
      '/reset-password',
      '/profile',
      '/logout',
      '/refresh',
    ]
    if (legacyAuthEndpoints.includes(config.url)) {
      config.url = `/api/auth${config.url}`
    }
  }
  return config
})

// Single-refresh mechanism state for concurrent 401 requests
interface FailedQueueItem {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}

let isRefreshing = false
let failedQueue: FailedQueueItem[] = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

// Axios Response Interceptor for automatic 401 token refresh & queueing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only process HTTP 401 Unauthorized errors.
    // Do NOT refresh for 400 Bad Request, 403 Forbidden, 404 Not Found, 409 Conflict, 422, 500, etc.
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    const requestUrl = (originalRequest?.url || '').toLowerCase()

    // Public authentication endpoints that MUST NEVER trigger token refresh or session expiration notifications
    const isPublicAuthEndpoint =
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/send-verify-otp') ||
      requestUrl.includes('/auth/resend-otp') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/send-reset-otp') ||
      requestUrl.includes('/auth/reset-password')

    const isRefreshEndpoint = requestUrl.includes('/auth/refresh')

    // Public auth requests reject directly to caller page without attempting token refresh
    if (isPublicAuthEndpoint) {
      return Promise.reject(error)
    }

    if (isRefreshEndpoint || originalRequest?._retry) {
      if (isRefreshEndpoint) {
        const hadUser = !!localStorage.getItem('tf_user')
        localStorage.removeItem('tf_user')
        if (hadUser) {
          window.dispatchEvent(new Event('auth-unauthorized'))
        }
      }
      return Promise.reject(error)
    }

    // Handle concurrent requests: queue requests if a refresh is already in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => {
          return api(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Send refresh request to Auth Service via API Gateway
      await api.post('/api/auth/refresh', {}, { withCredentials: true })

      // Refresh succeeded: new HttpOnly access token cookie set by backend
      isRefreshing = false
      processQueue(null)

      // Retry original request once (browser automatically includes new HttpOnly cookie)
      return api(originalRequest)
    } catch (refreshError: any) {
      // Refresh failed: session expired or invalid
      isRefreshing = false
      processQueue(refreshError)

      const hadUser = !!localStorage.getItem('tf_user')
      localStorage.removeItem('tf_user')

      if (hadUser) {
        window.dispatchEvent(new Event('auth-unauthorized'))
      }

      return Promise.reject(refreshError)
    }
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
  const authInitialized = useRef(false)
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

  // Initialize authentication state
  useEffect(() => {
    // Prevent duplicate initialization in React StrictMode
    if (authInitialized.current) {
      return
    }

    authInitialized.current = true

    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('tf_user')

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch {
            localStorage.removeItem('tf_user')
          }
        } else {
          // If no stored user exists in localStorage, skip initial profile request for guest load
          setLoading(false)
          return
        }

        const profile = await getProfile()

        setUser(profile)
        localStorage.setItem('tf_user', JSON.stringify(profile))
      } catch {
        setUser(null)
        localStorage.removeItem('tf_user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])
  // Listen to unauthorized interceptor event
  useEffect(() => {
    const handleUnauthorized = () => {
      const hadUser = !!user || !!localStorage.getItem('tf_user')
      setUser(null)
      localStorage.removeItem('tf_user')
      if (hadUser) {
        setToast({ message: 'Your session has expired. Please log in again.', type: 'error' })
        navigate('/login')
      }
    }

    window.addEventListener('auth-unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized)
    }
  }, [navigate, user])

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
        // OAuth flow (Google / GitHub): call getProfile() after OAuth redirect
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
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return
      }
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('tf_user')
      setToast({ message: 'Logout successful.', type: 'success' })
      navigate('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loginState, login, logout, loading, getProfile, fetchProfile, showToast }}>
      {children}
      <NetworkStatusToast />
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

// API Contract Endpoints routed through Gateway

export const registerUser = (username: string, email: string, password: string, signal?: AbortSignal) => {
  return api.post('/api/auth/register', { username, email, password }, { signal })
}

export const verifySignupOtp = (email: string, otp: string, signal?: AbortSignal) => {
  return api.post('/api/auth/send-verify-otp', { email, otp }, { signal })
}

export const resendOtp = (email: string, signal?: AbortSignal) => {
  return api.post('/api/auth/resend-otp', { email }, { signal })
}

export const loginUser = (email: string, password: string, signal?: AbortSignal) => {
  return api.post('/api/auth/login', { email, password }, { signal })
}

export const forgotPassword = (email: string, signal?: AbortSignal) => {
  return api.post('/api/auth/forgot-password', { email }, { signal })
}

export const verifyResetOtp = (email: string, otp: string, signal?: AbortSignal) => {
  return api.post('/api/auth/send-reset-otp', { email, otp }, { signal })
}

export const resetPassword = (email: string, otp: string, newPassword: string, signal?: AbortSignal) => {
  return api.post('/api/auth/reset-password', { email, otp, newPassword }, { signal })
}

export const getUserProfile = (signal?: AbortSignal) => {
  return api.get('/api/auth/profile', { signal })
}

export const getProfile = getUserProfile

export const logoutUser = () => api.post('/api/auth/logout', {}, { withCredentials: true })

export const refreshToken = () => api.post('/api/auth/refresh', {}, { withCredentials: true })

// Reusable standard API error handling utility
export function getErrorMessage(error: any): string {
  if (axios.isCancel(error)) {
    return ''
  }

  // Extract sanitized backend response message across standard API error fields
  if (error?.response?.data) {
    const data = error.response.data

    if (typeof data === 'string' && data.length < 200 && !data.includes('Exception') && !data.includes('at ')) {
      return data
    }

    if (data.message && typeof data.message === 'string' && !data.message.includes('Exception') && !data.message.includes('Stack:')) {
      return data.message
    }

    if (data.error && typeof data.error === 'string' && !data.error.includes('Exception') && !data.error.includes('Stack:')) {
      return data.error
    }

    if (data.error_description && typeof data.error_description === 'string') {
      return data.error_description
    }

    if (data.detail && typeof data.detail === 'string') {
      return data.detail
    }

    if (data.errorMessage && typeof data.errorMessage === 'string') {
      return data.errorMessage
    }

    if (data.description && typeof data.description === 'string') {
      return data.description
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstErr = data.errors[0]
      if (typeof firstErr === 'string') return firstErr
      if (firstErr?.defaultMessage && typeof firstErr.defaultMessage === 'string') return firstErr.defaultMessage
      if (firstErr?.message && typeof firstErr.message === 'string') return firstErr.message
    }
  }

  // Inspect request URL to accurately distinguish public auth requests from protected session requests
  const requestUrl = (error?.config?.url || '').toLowerCase()

  const isRegisterRequest = requestUrl.includes('/register')
  const isLoginRequest = requestUrl.includes('/login')
  const isOtpRequest = requestUrl.includes('/send-verify-otp') || requestUrl.includes('/resend-otp')
  const isPasswordResetRequest =
    requestUrl.includes('/forgot-password') ||
    requestUrl.includes('/send-reset-otp') ||
    requestUrl.includes('/reset-password')
  const isPublicAuthRequest = isRegisterRequest || isLoginRequest || isOtpRequest || isPasswordResetRequest

  // Handle explicit HTTP status codes
  const status = error?.response?.status
  if (status) {
    switch (status) {
      case 400:
        if (isRegisterRequest) {
          return 'Registration request invalid. Please check your full name, email, and password.'
        }
        if (isLoginRequest) {
          return 'Invalid login request. Please enter a valid email and password.'
        }
        return 'Invalid request payload. Please check your inputs and try again.'

      case 401:
        if (isRegisterRequest) {
          return 'Registration failed. Please check your details and try again.'
        }
        if (isLoginRequest) {
          return 'Invalid email or password. Please try again.'
        }
        if (isOtpRequest) {
          return 'Invalid or expired verification code. Please try again.'
        }
        if (isPasswordResetRequest) {
          return 'Password reset authorization failed. Please request a new OTP.'
        }
        if (isPublicAuthRequest) {
          return 'Authentication failed. Please verify your details and try again.'
        }
        return 'Your session has expired. Please log in again.'

      case 403:
        if (isRegisterRequest) {
          return 'Registration rejected. An account with this email may already exist.'
        }
        if (isLoginRequest) {
          return 'Account unverified or access restricted.'
        }
        return 'You do not have permission to access this resource.'

      case 404:
        if (isLoginRequest) {
          return 'Account not found. Please check your email or sign up.'
        }
        return 'The requested resource was not found on the server.'

      case 409:
        if (isRegisterRequest) {
          return 'An account with this email address already exists.'
        }
        return 'A resource conflict occurred. This record may already exist.'

      case 422:
        return 'Validation failed. Please check your inputs and try again.'

      case 429:
        return 'Too many requests. Please wait a moment before trying again.'

      case 500:
        return 'An internal server error occurred. Please try again later.'

      case 502:
      case 503:
      case 504:
        return 'The backend service is temporarily unavailable. Please try again in a few moments.'
    }
  }

  // Request timeouts
  if (error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')) {
    return 'The server request timed out. Please check your connection and retry.'
  }

  // Network offline / connection failures
  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK' || !navigator.onLine) {
    return 'Network connection error. Please check your internet connection or verify the backend server status.'
  }

  if (isRegisterRequest) {
    return 'Registration failed. Please try again.'
  }

  return 'An unexpected error occurred. Please try again.'
}
