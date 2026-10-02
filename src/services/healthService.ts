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
 * Returns the readiness status object.
 * Handles HTTP 200, HTTP 503 (cold start), timeouts, and network errors gracefully.
 */
export const checkServiceReadiness = async (
  signal?: AbortSignal
): Promise<ServiceReadinessResponse> => {
  // Use gateway base URL from API config
  const url = `${API.BASE_URL}/health/ready`

  try {
    const response = await axios.get<ServiceReadinessResponse>(url, {
      signal,
      timeout: 8000,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })

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
      throw err
    }

    // HTTP 503 is a standard cold-start response when microservices are booting up
    if (err.response?.status === 503 && err.response?.data) {
      const data = err.response.data
      return {
        status: data.status || 'STARTING',
        authService: data.authService || 'STARTING',
        resumeService: data.resumeService || 'STARTING',
        ready: false,
      }
    }

    // 401 or 403 authorization failures are non-retryable for health checks
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error(`Authentication failure during service check (${err.response.status})`)
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
