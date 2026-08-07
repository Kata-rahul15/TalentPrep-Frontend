import { mockApi } from '../mock/resumeMock'
import type {
  ResumeFile,
  ResumeDetails,
  ResumeEvaluation,
  JobMatchResult,
  ChatMessage,
  UploadResumeResponse,
} from '../types/resume.types'

// ─── Resume API ───────────────────────────────────────────────────────────────
// This is the only layer that talks to the data source.
// Swapping mock → real backend only requires changing this file.

export const resumeApi = {
  /**
   * GET /resume
   * Returns the user's uploaded resume metadata, or null if none exists.
   */
  getResume: async (): Promise<ResumeFile | null> => {
    return mockApi.getResume()
  },

  /**
   * POST /resume/upload
   * Uploads a resume file and returns upload metadata.
   */
  uploadResume: async (file: File): Promise<UploadResumeResponse> => {
    return mockApi.uploadResume(file)
  },

  /**
   * GET /resume/details
   * Returns the structured, parsed content of the resume.
   */
  getResumeDetails: async (): Promise<ResumeDetails> => {
    return mockApi.getResumeDetails()
  },

  /**
   * POST /resume/evaluate
   * Triggers AI evaluation of the resume and returns scores/suggestions.
   */
  evaluateResume: async (): Promise<ResumeEvaluation> => {
    return mockApi.evaluateResume()
  },

  /**
   * POST /resume/job-match
   * Matches resume against a pasted job description.
   */
  matchJob: async (jobDescription: string): Promise<JobMatchResult> => {
    return mockApi.matchJob(jobDescription)
  },

  /**
   * POST /resume/chat
   * Sends a message to the resume AI chat assistant.
   */
  chat: async (message: string, history: ChatMessage[]): Promise<ChatMessage> => {
    return mockApi.chat(message, history)
  },
}
