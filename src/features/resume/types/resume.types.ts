// ─── Core Resume DTOs ────────────────────────────────────────────────────────

export interface ResumeFile {
  id: string
  fileName: string
  fileSize: number // bytes
  fileType: 'PDF' | 'DOCX'
  uploadedAt: string // ISO 8601
  status: 'processing' | 'ready' | 'error'
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null // null = present
  description: string[]
  technologies: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  highlights: string[]
  repoUrl?: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear: number | null
  gpa?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  credentialId?: string
}

export interface ResumeDetails {
  resumeId: string
  name: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  github?: string
  professionalSummary: string
  skills: string[]
  workExperience: WorkExperience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
}

// ─── Evaluation DTOs ─────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  atsScore: number
  keywordMatch: number
  formattingScore: number
  technicalSkillsScore: number
  experienceScore: number
  educationScore: number
  overallScore: number
}

export interface ResumeSuggestion {
  section: string
  priority: 'high' | 'medium' | 'low'
  message: string
}

export interface ResumeEvaluation {
  resumeId: string
  evaluatedAt: string
  scores: ScoreBreakdown
  strengths: string[]
  weaknesses: string[]
  suggestions: ResumeSuggestion[]
  missingKeywords: string[]
}

// ─── Job Match DTOs ──────────────────────────────────────────────────────────

export interface JobMatchRequest {
  jobDescription: string
}

export interface SkillMatch {
  skill: string
  matched: boolean
}

export interface JobMatchResult {
  overallMatch: number
  matchedSkills: string[]
  missingSkills: string[]
  missingKeywords: string[]
  recommendations: string[]
}

// ─── Chat DTOs ───────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: string
}

export interface ChatRequest {
  message: string
  conversationHistory: ChatMessage[]
}

export interface ChatResponse {
  message: ChatMessage
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface UploadResumeResponse {
  resumeId: string
  fileName: string
  uploadedAt: string
  status: 'processing' | 'ready'
}
