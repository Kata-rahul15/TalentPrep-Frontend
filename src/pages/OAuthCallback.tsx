import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/services/authService'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { user, loading, getProfile } = useAuth()

  useEffect(() => {
    let active = true

    const processOAuth = async () => {
      try {
        if (!user) {
          await getProfile()
        }
        if (active) {
          navigate('/home', { replace: true })
        }
      } catch {
        if (active) {
          navigate('/', { replace: true })
        }
      }
    }

    if (!loading) {
      if (user) {
        navigate('/home', { replace: true })
      } else {
        processOAuth()
      }
    }
  }, [user, loading, getProfile, navigate])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
