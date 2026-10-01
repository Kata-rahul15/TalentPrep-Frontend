import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { resumeApi } from '../api/resumeApi'

import type {
  ChatMessage,
  JobMatchInput,
  JobMatchStatusResponse,
} from '../types/resume.types'

import {
  useState,
  useCallback,
} from 'react'


// ─────────────────────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────────────────────

export const resumeKeys = {

  all: ['resume'] as const,

  file: () =>
    [...resumeKeys.all, 'file'] as const,

  details: () =>
    [...resumeKeys.all, 'details'] as const,

  evaluation: () =>
    [...resumeKeys.all, 'evaluation'] as const,

}


// ─────────────────────────────────────────────────────────────
// useResume
// ─────────────────────────────────────────────────────────────

/**
 * Fetches the uploaded resume metadata.
 *
 * While the backend is processing the resume,
 * this query polls every 3 seconds.
 *
 * Polling automatically stops when the status becomes:
 *
 * ready
 * error
 */
export function useResume() {

  return useQuery({

    queryKey: resumeKeys.file(),

    queryFn: () =>
      resumeApi.getResume(),

    staleTime: 5 * 60 * 1000,

    refetchInterval: (query) => {

      const status =
        query.state.data?.status

      if (status === 'processing') {
        return 3000
      }

      return false
    },

  })
}


// ─────────────────────────────────────────────────────────────
// useResumeDetails
// ─────────────────────────────────────────────────────────────

/**
 * Fetches structured/parsed resume content.
 *
 * IMPORTANT:
 *
 * Do NOT call this while the resume is processing.
 *
 * The backend creates the structured resume data
 * during background processing.
 */
export function useResumeDetails(
  enabled: boolean = true
) {

  const {
    data: resume,
  } = useResume()

  const canLoadDetails =
    enabled &&
    resume?.status === 'ready'

  return useQuery({

    queryKey: resumeKeys.details(),

    queryFn: () =>
      resumeApi.getResumeDetails(),

    staleTime: 5 * 60 * 1000,

    enabled: canLoadDetails,

  })
}


// ─────────────────────────────────────────────────────────────
// useResumeEvaluation
// ─────────────────────────────────────────────────────────────

/**
 * Fetches the already-generated ATS evaluation.
 *
 * IMPORTANT:
 *
 * This endpoint must NOT be called while the resume
 * is still being processed.
 *
 * It only becomes enabled when:
 *
 * resume.status === 'ready'
 */
export function useResumeEvaluation(
  enabled: boolean = true
) {

  const {
    data: resume,
  } = useResume()

  const canLoadEvaluation =
    enabled &&
    resume?.status === 'ready'

  return useQuery({

    queryKey: resumeKeys.evaluation(),

    queryFn: () =>
      resumeApi.evaluateResume(),

    staleTime: 10 * 60 * 1000,

    enabled: canLoadEvaluation,

  })
}


// ─────────────────────────────────────────────────────────────
// useUploadResume
// ─────────────────────────────────────────────────────────────

/**
 * Uploads the resume.
 *
 * The backend now returns quickly with PROCESSING.
 *
 * It does NOT wait for AI analysis.
 */
export function useUploadResume() {

  const queryClient =
    useQueryClient()

  return useMutation({

    mutationFn: (file: File) =>
      resumeApi.uploadResume(file),

    onSuccess: () => {

      // Resume status will now be fetched again.
      queryClient.invalidateQueries({
        queryKey: resumeKeys.file(),
      })

      // These will NOT execute immediately because
      // their queries are disabled while status === processing.
      queryClient.invalidateQueries({
        queryKey: resumeKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: resumeKeys.evaluation(),
      })

    },

  })
}


// ─────────────────────────────────────────────────────────────
// useEvaluateResume
// ─────────────────────────────────────────────────────────────

/**
 * Manually fetches the existing ATS evaluation.
 *
 * This should only be used when the resume is READY.
 */
export function useEvaluateResume() {

  const queryClient =
    useQueryClient()

  return useMutation({

    mutationFn: () =>
      resumeApi.evaluateResume(),

    onSuccess: (data) => {

      queryClient.setQueryData(
        resumeKeys.evaluation(),
        data
      )

    },

  })
}


// ─────────────────────────────────────────────────────────────
// useJobMatch
// ─────────────────────────────────────────────────────────────

/**
 * Matches a ready resume against a job description.
 */
export function useJobMatch() {
  return useMutation({
    mutationFn: ({
      input,
      resumeId,
    }: {
      input: JobMatchInput
      resumeId: string
    }) =>
      resumeApi.matchJob(
        input,
        resumeId
      ),
  })
}
export function useJobMatchStatus(
  resumeId?: string,
  matchId?: string
) {
  return useQuery({
    queryKey: [
      'job-match',
      resumeId,
      matchId,
    ],

    queryFn: () =>
      resumeApi.getJobMatchStatus(
        resumeId!,
        matchId!
      ),

    enabled:
      Boolean(resumeId) &&
      Boolean(matchId),

    refetchInterval: (query) => {
      const status =
        query.state.data?.status

      if (
        status === 'COMPLETED' ||
        status === 'FAILED'
      ) {
        return false
      }

      return 2000
    },
  })
}

// ─────────────────────────────────────────────────────────────
// useResumeChat
// ─────────────────────────────────────────────────────────────

export function useResumeChat() {

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "👋 Hi! I'm your **Resume AI Assistant**. I've analyzed your resume and I'm ready to answer questions about your experience, skills, projects, and how to improve your profile. What would you like to know?",
        timestamp:
          new Date().toISOString(),
      },
    ])

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const sendMessage =
    useCallback(
      async (content: string) => {

        const trimmedContent =
          content.trim()

        if (
          !trimmedContent ||
          isLoading
        ) {
          return
        }

        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: trimmedContent,
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [
          ...prev,
          userMessage,
        ])

        setIsLoading(true)
        setError(null)

        try {

          const response =
            await resumeApi.chat(
              trimmedContent
            )

          setMessages((prev) => [
            ...prev,
            response,
          ])

        } catch (err) {

          console.error(
            '[Resume Chat] Failed:',
            err
          )

          setError(
            'Failed to get a response. Please try again.'
          )

        } finally {

          setIsLoading(false)

        }
      },
      [isLoading]
    )

  // clearHistory stays the same...
  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "👋 Hi! I'm your **Resume AI Assistant**. I've analyzed your resume and I'm ready to answer questions about your experience, skills, projects, and how to improve your profile. What would you like to know?",
        timestamp: new Date().toISOString(),
      },
    ])

    setError(null)
  }, [])
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  }
}