import axios from 'axios'
import { API } from '@/config/api'

export interface ServiceReadinessResponse {
  status: string
  authService?: string
  resumeService?: string
  ready: boolean
}

/**
 * Calls the API Gateway readiness endpoint GET /health/ready.
 * Returns normalized readiness status object.
 * Handles HTTP 200, HTTP 503 (cold start), timeouts, and network errors gracefully.
 */
export const checkServiceReadiness = async (
  signal?: AbortSignal,
  pollAttempt: number = 1
): Promise<ServiceReadinessResponse> => {
  const gatewayUrl = API.BASE_URL.replace(/\/+$/, '')
  const readinessUrl = `${gatewayUrl}/health/ready`

  console.log(`[ServiceReadiness] Poll attempt number: ${pollAttempt}`)
  console.log(`[ServiceReadiness] Readiness request URL: ${readinessUrl}`)

  try {
    const response = await axios.get<ServiceReadinessResponse>(readinessUrl, {
      signal,
      timeout: 8000,
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })

    console.log(`[ServiceReadiness] Gateway HTTP status: ${response.status}`)
    console.log(`[ServiceReadiness] Actual response JSON:`, response.data)

    if (response.data && typeof response.data === 'object') {
      return {
        status: response.data.status || (response.data.ready ? 'READY' : 'STARTING'),
        authService: response.data.authService || (response.data.ready ? 'UP' : 'STARTING'),
        resumeService: response.data.resumeService || (response.data.ready ? 'UP' : 'STARTING'),
        ready: Boolean(response.data.ready),
      }
    }

    return {
      status: 'STARTING',
      authService: 'STARTING',
      resumeService: 'STARTING',
      ready: false,
    }
  } catch (err: any) {
    if (axios.isCancel(err)) {
      console.log(`[ServiceReadiness] Request to ${readinessUrl} was canceled.`)
      throw err
    }

    const status = err.response?.status
    console.warn(`[ServiceReadiness] Network or timeout error:`, err.message, status ? `(HTTP ${status})` : '')

    // HTTP 503 is a standard cold-start response when microservices are booting up
    if (status === 503 && err.response?.data) {
      const data = err.response.data
      console.log(`[ServiceReadiness] Gateway HTTP status: 503`)
      console.log(`[ServiceReadiness] Actual response JSON:`, data)
      return {
        status: data.status || 'STARTING',
        authService: data.authService || 'STARTING',
        resumeService: data.resumeService || 'STARTING',
        ready: false,
      }
    }

    // 401 or 403 authorization failures are non-retryable for health checks
    if (status === 401 || status === 403) {
      throw new Error(`Authentication failure during service check (${status})`)
    }

    // Cold start network connection error, gateway timeout, or 502/503 without body
    return {
      status: 'STARTING',
      authService: 'STARTING',
      resumeService: 'STARTING',
      ready: false,
    }
  }
}
