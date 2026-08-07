import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resumeApi } from '../api/resumeApi'
import type { ChatMessage } from '../types/resume.types'
import { useState, useCallback } from 'react'

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const resumeKeys = {
  all: ['resume'] as const,
  file: () => [...resumeKeys.all, 'file'] as const,
  details: () => [...resumeKeys.all, 'details'] as const,
  evaluation: () => [...resumeKeys.all, 'evaluation'] as const,
}

// ─── useResume ────────────────────────────────────────────────────────────────
/** Fetches the uploaded resume metadata (file info) */
export function useResume() {
  return useQuery({
    queryKey: resumeKeys.file(),
    queryFn: () => resumeApi.getResume(),
    staleTime: 5 * 60 * 1000,
  })
}

// ─── useResumeDetails ────────────────────────────────────────────────────────
/** Fetches structured/parsed resume content */
export function useResumeDetails() {
  return useQuery({
    queryKey: resumeKeys.details(),
    queryFn: () => resumeApi.getResumeDetails(),
    staleTime: 5 * 60 * 1000,
  })
}

// ─── useResumeEvaluation ─────────────────────────────────────────────────────
/** Fetches or triggers AI evaluation of the resume */
export function useResumeEvaluation(enabled: boolean = true) {
  return useQuery({
    queryKey: resumeKeys.evaluation(),
    queryFn: () => resumeApi.evaluateResume(),
    staleTime: 10 * 60 * 1000,
    enabled,
  })
}

// ─── useUploadResume ──────────────────────────────────────────────────────────
/** Mutation: upload a resume file */
export function useUploadResume() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => resumeApi.uploadResume(file),
    onSuccess: () => {
      // Invalidate so next fetch picks up the new resume
      queryClient.invalidateQueries({ queryKey: resumeKeys.file() })
      queryClient.invalidateQueries({ queryKey: resumeKeys.details() })
      queryClient.invalidateQueries({ queryKey: resumeKeys.evaluation() })
    },
  })
}

// ─── useEvaluateResume ────────────────────────────────────────────────────────
/** Mutation: trigger a fresh AI evaluation */
export function useEvaluateResume() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => resumeApi.evaluateResume(),
    onSuccess: (data) => {
      queryClient.setQueryData(resumeKeys.evaluation(), data)
    },
  })
}

// ─── useJobMatch ──────────────────────────────────────────────────────────────
/** Mutation: match resume against a job description */
export function useJobMatch() {
  return useMutation({
    mutationFn: (jobDescription: string) => resumeApi.matchJob(jobDescription),
  })
}

// ─── useResumeChat ────────────────────────────────────────────────────────────
/** Manages resume chat state and sends messages */
export function useResumeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "👋 Hi! I'm your **Resume AI Assistant**. I've analyzed your resume and I'm ready to answer questions about your experience, skills, projects, and how to improve your profile. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await resumeApi.chat(content, messages)
      setMessages((prev) => [...prev, response])
    } catch (err) {
      setError('Failed to get a response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "👋 Hi! I'm your **Resume AI Assistant**. I've analyzed your resume and I'm ready to answer questions. What would you like to know?",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  return { messages, isLoading, error, sendMessage, clearHistory }
}
