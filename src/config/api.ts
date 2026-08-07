export const API = {
  AUTH_BASE_URL: import.meta.env.VITE_AUTH_BASE_URL || 'https://authentication-system-1-ndpa.onrender.com',
  // Future service base URLs can be added here without architectural refactoring:
  // RESUME_BASE_URL: import.meta.env.VITE_RESUME_BASE_URL || '',
  // INTERVIEW_BASE_URL: import.meta.env.VITE_INTERVIEW_BASE_URL || '',
  // AI_BASE_URL: import.meta.env.VITE_AI_BASE_URL || '',
} as const
