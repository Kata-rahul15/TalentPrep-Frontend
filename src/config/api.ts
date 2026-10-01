const getGatewayUrl = (): string => {
  const envUrl =
    import.meta.env.VITE_API_GATEWAY_URL ||
    import.meta.env.VITE_AUTH_BASE_URL ||
    'http://localhost:8080'
  return envUrl.replace(/\/api\/auth\/?$/, '').replace(/\/+$/, '')
}

export const API = {
  BASE_URL: getGatewayUrl(),
  AUTH_BASE_URL: `${getGatewayUrl()}/api/auth`,
  RESUME_BASE_URL: `${getGatewayUrl()}/api/resumes`,
} as const

