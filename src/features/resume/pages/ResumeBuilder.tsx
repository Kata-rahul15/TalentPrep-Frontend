import { useState, useCallback, useRef, useEffect } from 'react'
import type {
  ResumeBuilderData,
  ResumeSectionKey,
  ResumeTemplateId,
} from '../types/builder.types'
import { DEFAULT_EMPTY_RESUME } from '../types/builder.types'
import {
  calculateResumeCompleteness,
  convertResumeDetailsToBuilderData,
  hasBuilderContent,
} from '../utils/builderUtils'
import { migrateLegacySkillCategories } from '../utils/skillTaxonomy'
import { useResumes } from '../hooks/useResume'
import ResumeBuilderToolbar from '../components/builder/ResumeBuilderToolbar'
import ResumeSectionSidebar from '../components/builder/ResumeSectionSidebar'
import ResumeEditorPanel from '../components/builder/ResumeEditorPanel'
import ResumePreview from '../components/builder/ResumePreview'
import ResumeCreationModal from '../components/builder/ResumeCreationModal'
import ResumeTemplateGalleryModal from '../components/builder/ResumeTemplateGalleryModal'
import AIImproveModal from '../components/builder/AIImproveModal'
import { resumeApi } from '../api/resumeApi'
import { useResumeContext } from '../context/ResumeContext'
import { downloadResumePdf } from '../utils/pdfExport'

function getStorageKey(resumeId?: string | null): string {
  return resumeId ? `talentprep_resume_builder_draft_${resumeId}` : 'talentprep_resume_builder_draft_default'
}

export default function ResumeBuilder() {
  const { data: availableResumes } = useResumes()
  const { selectedResumeId, setSelectedResumeId } = useResumeContext()
  const [isLoadingBuilder, setIsLoadingBuilder] = useState(true)

  // Initialize with empty draft
  const [resumeData, setResumeData] = useState<ResumeBuilderData>(() => ({
    ...DEFAULT_EMPTY_RESUME,
    lastModified: new Date().toISOString(),
  }))

  // Undo / Redo History Stacks
  const [undoStack, setUndoStack] = useState<ResumeBuilderData[]>([])
  const [redoStack, setRedoStack] = useState<ResumeBuilderData[]>([])

  // Active section & view states
  const [activeSection, setActiveSection] = useState<ResumeSectionKey>('personal')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false)
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit')

  // Modals
  const [isCreationModalOpen, setIsCreationModalOpen] = useState<boolean>(false)
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState<boolean>(false)

  // AI Improve Modal state
  const [aiModalConfig, setAiModalConfig] = useState<{
    isOpen: boolean
    originalText: string
    contextLabel: string
    targetField?: string
  }>({
    isOpen: false,
    originalText: '',
    contextLabel: '',
  })

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Auto-select first available resume if none selected ──
  useEffect(() => {
    if (!selectedResumeId && availableResumes && availableResumes.length > 0) {
      const firstId = availableResumes[0].id
      if (firstId) {
        setSelectedResumeId(firstId)
      }
    }
  }, [selectedResumeId, availableResumes, setSelectedResumeId])

  // ── Load Builder Data Flow: Priority Resolution ──
  // Priority: 1. Existing Saved Builder Data -> 2. Parsed Resume Details -> 3. Empty Fallback
  useEffect(() => {
    let cancelled = false

    const loadResumeData = async () => {
      setIsLoadingBuilder(true)
      setUndoStack([])
      setRedoStack([])

      const targetResumeId = selectedResumeId || (availableResumes && availableResumes[0]?.id)

      if (!targetResumeId) {
        // Check local recovery draft for default
        try {
          const cached = localStorage.getItem(getStorageKey(null))
          if (cached) {
            const parsed = JSON.parse(cached)
            if (!cancelled) setResumeData(parsed)
            setIsLoadingBuilder(false)
            return
          }
        } catch (e) {
          console.warn('[ResumeBuilder] Failed reading local recovery draft:', e)
        }

        if (!cancelled) {
          setResumeData({ ...DEFAULT_EMPTY_RESUME, lastModified: new Date().toISOString() })
          setIsLoadingBuilder(false)
        }
        return
      }

      try {
        let loadedData: ResumeBuilderData | null = null

        // ── Priority 1: Check backend saved Builder draft ──
        try {
          const rawBuilder = await resumeApi.getBuilder(targetResumeId)
          if (rawBuilder && hasBuilderContent(rawBuilder)) {
            const fallback = { ...DEFAULT_EMPTY_RESUME, id: targetResumeId }
            const personal = rawBuilder?.personalInfo || {}
            loadedData = {
              ...fallback,
              ...rawBuilder,
              id: targetResumeId,
              title: rawBuilder?.title || fallback.title,
              lastModified: rawBuilder?.lastModified || new Date().toISOString(),
              personalInfo: { ...fallback.personalInfo, ...personal },
              experience: (rawBuilder?.experience || []).map((item: any, index: number) => ({
                id: item.id || `exp-${index + 1}`,
                company: item.company || '',
                role: item.role || '',
                location: item.location || '',
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                isCurrent: Boolean(item.isCurrent || (!item.endDate && item.endDate !== null)),
                highlights: item.highlights || item.responsibilities || item.achievements || [],
              })),
              education: (rawBuilder?.education || []).map((item: any, index: number) => ({
                id: item.id || `edu-${index + 1}`,
                institution: item.institution || '',
                degree: item.degree || '',
                field: item.field || item.fieldOfStudy || '',
                location: item.location || '',
                startYear: item.startYear || item.startDate || '',
                graduationYear: item.graduationYear || item.endDate || '',
                gpa: item.gpa || item.grade || '',
                coursework: item.coursework || item.details || '',
              })),
              skills: migrateLegacySkillCategories(
                rawBuilder?.skills && rawBuilder.skills.length > 0 ? rawBuilder.skills : fallback.skills
              ),
              projects: (rawBuilder?.projects || []).map((item: any, index: number) => ({
                id: item.id || `proj-${index + 1}`,
                name: item.name || '',
                description: item.description || '',
                technologies: item.technologies || [],
                highlights: item.highlights || [],
                repoUrl: item.repoUrl,
                liveUrl: item.liveUrl,
                startDate: item.startDate,
                endDate: item.endDate,
              })),
              certifications: rawBuilder?.certifications || [],
              achievements: rawBuilder?.achievements || [],
              customSections: rawBuilder?.customSections || [],
              sectionOrder: rawBuilder?.sectionOrder || fallback.sectionOrder,
              sectionVisibility: { ...fallback.sectionVisibility, ...(rawBuilder?.sectionVisibility || {}) },
            }
          }
        } catch (builderErr) {
          console.log('[ResumeBuilder] No saved backend builder draft found, checking parsed details:', builderErr)
        }

        // Check local storage draft if backend had no content
        if (!loadedData) {
          try {
            const cached = localStorage.getItem(getStorageKey(targetResumeId))
            if (cached) {
              const parsed = JSON.parse(cached)
              if (hasBuilderContent(parsed)) {
                loadedData = {
                  ...parsed,
                  skills: migrateLegacySkillCategories(parsed.skills),
                }
              }
            }
          } catch (storageErr) {
            console.warn('[ResumeBuilder] Local storage read error:', storageErr)
          }
        }

        // ── Priority 2: Use existing parsed Resume Details data ──
        if (!loadedData) {
          try {
            console.log('[ResumeBuilder] Fetching structured resume details for ID:', targetResumeId)
            const details = await resumeApi.getResumeDetails(targetResumeId)
            if (details) {
              const converted = convertResumeDetailsToBuilderData(details)
              loadedData = converted
              // Cache initial converted data locally
              localStorage.setItem(getStorageKey(targetResumeId), JSON.stringify(converted))
            }
          } catch (detailsErr) {
            console.warn('[ResumeBuilder] Could not fetch parsed resume details:', detailsErr)
          }
        }

        // ── Priority 3: Fallback to Empty Template ──
        if (!loadedData) {
          loadedData = {
            ...DEFAULT_EMPTY_RESUME,
            id: targetResumeId,
            lastModified: new Date().toISOString(),
          }
        }

        if (!cancelled) {
          setResumeData(loadedData)
          setSaveStatus('saved')
        }
      } catch (error) {
        console.error('[ResumeBuilder] Unexpected error loading builder:', error)
      } finally {
        if (!cancelled) setIsLoadingBuilder(false)
      }
    }

    loadResumeData()
    return () => {
      cancelled = true
    }
  }, [selectedResumeId, availableResumes])

  // ── Save Draft Helper ──
  const persistDraft = useCallback(async (dataToSave: ResumeBuilderData) => {
    try {
      setSaveStatus('saving')
      const payload = { ...dataToSave, lastModified: new Date().toISOString() }
      const key = getStorageKey(selectedResumeId)
      localStorage.setItem(key, JSON.stringify(payload))

      if (selectedResumeId) {
        await resumeApi.saveBuilder(selectedResumeId, payload)
      }
      setSaveStatus('saved')
    } catch (e) {
      console.error('[ResumeBuilder] Backend save failed:', e)
      setSaveStatus('error')
    }
  }, [selectedResumeId])

  // ── State Update with Undo Tracking & Debounced Auto-Save ──
  const handleDataChange = useCallback(
    (newData: ResumeBuilderData, trackUndo = true) => {
      if (trackUndo) {
        setUndoStack((prev) => [...prev.slice(-20), resumeData])
        setRedoStack([])
      }
      setResumeData(newData)
      setSaveStatus('unsaved')

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
      saveTimerRef.current = setTimeout(() => {
        persistDraft(newData)
      }, 1000)
    },
    [resumeData, persistDraft]
  )

  // ── Undo / Redo Actions ──
  const handleUndo = () => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    const newUndo = undoStack.slice(0, -1)
    setRedoStack((prevRedo) => [...prevRedo, resumeData])
    setUndoStack(newUndo)
    setResumeData(prev)
    persistDraft(prev)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    const newRedo = redoStack.slice(0, -1)
    setUndoStack((prevUndo) => [...prevUndo, resumeData])
    setRedoStack(newRedo)
    setResumeData(next)
    persistDraft(next)
  }

  // ── Section Sidebar Controls ──
  const handleToggleSectionVisibility = (section: ResumeSectionKey) => {
    const current = resumeData.sectionVisibility[section] !== false
    handleDataChange({
      ...resumeData,
      sectionVisibility: {
        ...resumeData.sectionVisibility,
        [section]: !current,
      },
    })
  }

  const handleMoveSection = (section: ResumeSectionKey, direction: 'up' | 'down') => {
    const order = [...resumeData.sectionOrder]
    const idx = order.indexOf(section)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= order.length) return
    const temp = order[idx]
    order[idx] = order[targetIdx]
    order[targetIdx] = temp
    handleDataChange({ ...resumeData, sectionOrder: order })
  }

  // ── Template Switcher ──
  const handleSelectTemplate = (templateId: ResumeTemplateId) => {
    handleDataChange({ ...resumeData, selectedTemplate: templateId })
  }

  // ── AI Improve Trigger ──
  const handleOpenAiImprove = (text: string, context: string, targetField?: string) => {
    setAiModalConfig({
      isOpen: true,
      originalText: text,
      contextLabel: context,
      targetField,
    })
  }

  const handleApplyAiSuggestion = (improvedText: string) => {
    if (aiModalConfig.targetField === 'summary') {
      handleDataChange({ ...resumeData, summary: improvedText })
    } else if (aiModalConfig.targetField === 'experience_bullet') {
      handleDataChange({
        ...resumeData,
        experience: resumeData.experience.map((exp) => ({
          ...exp,
          highlights: exp.highlights.map((h) =>
            h === aiModalConfig.originalText ? improvedText : h
          ),
        })),
      })
    } else if (aiModalConfig.targetField === 'project_description') {
      handleDataChange({
        ...resumeData,
        projects: resumeData.projects.map((p) =>
          p.description === aiModalConfig.originalText ? { ...p, description: improvedText } : p
        ),
      })
    }
  }

  // ── PDF Export Action ──
  const handleDownloadPdf = async () => {
    try {
      await persistDraft(resumeData)

      const filename = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName} - Resume`
        : (resumeData.title || 'TalentPrep Resume')

      await downloadResumePdf(resumeData, filename)
    } catch (error) {
      console.error('[ResumeBuilder] PDF download failed:', error)
      window.alert('We could not generate the PDF. Please try again. If the problem persists, check the browser console for details.')
    }
  }

  if (isLoadingBuilder) {
    return (
      <div className="min-h-[560px] flex items-center justify-center rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="text-center space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Loading your resume in builder...
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Loading structured sections from your uploaded resume.
          </p>
        </div>
      </div>
    )
  }

  // Completeness Calculation
  const completeness = calculateResumeCompleteness(resumeData)

  return (
    <div className="space-y-3 pb-8">
      {/* ── Top Workspace Toolbar ── */}
      <ResumeBuilderToolbar
        documentTitle={resumeData.title}
        onTitleChange={(title) => handleDataChange({ ...resumeData, title })}
        saveStatus={saveStatus}
        selectedTemplate={resumeData.selectedTemplate}
        onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
        onSaveDraft={() => persistDraft(resumeData)}
        onDownloadPdf={handleDownloadPdf}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        mobileViewMode={mobileViewMode}
        onToggleMobileView={setMobileViewMode}
        availableResumes={availableResumes}
        selectedResumeId={selectedResumeId}
        onSelectResume={(id) => setSelectedResumeId(id)}
        onOpenCreationModal={() => setIsCreationModalOpen(true)}
      />

      {/* ── Three-Panel Desktop Workspace Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Panel 1: Left Section Navigation Sidebar */}
        <div
          className={`lg:col-span-3 xl:col-span-3 ${
            mobileViewMode === 'preview' ? 'hidden xl:block' : 'block'
          }`}
        >
          <ResumeSectionSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            data={resumeData}
            onToggleVisibility={handleToggleSectionVisibility}
            onMoveSection={handleMoveSection}
            completeness={completeness}
          />
        </div>

        {/* Panel 2: Center Active Section Editor */}
        <div
          className={`lg:col-span-9 xl:col-span-4 min-h-[560px] flex flex-col ${
            mobileViewMode === 'preview' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          <ResumeEditorPanel
            activeSection={activeSection}
            data={resumeData}
            onChange={handleDataChange}
            onImproveWithAI={handleOpenAiImprove}
          />
        </div>

        {/* Panel 3: Right Live A4 Preview */}
        <div
          className={`xl:col-span-5 h-[760px] sticky top-4 ${
            mobileViewMode === 'edit' ? 'hidden xl:block' : 'block'
          }`}
        >
          <ResumePreview
            data={resumeData}
            isFullscreen={isFullscreenPreview}
            onToggleFullscreen={() => setIsFullscreenPreview(!isFullscreenPreview)}
          />
        </div>
      </div>

      {/* ── Creation / Import Modal ── */}
      <ResumeCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelectFlow={(newData, targetResumeId) => {
          if (targetResumeId) {
            setSelectedResumeId(targetResumeId)
          }
          handleDataChange(newData)
          setIsCreationModalOpen(false)
        }}
        availableResumes={availableResumes}
        currentResumeId={selectedResumeId}
      />

      {/* ── Template Gallery Modal ── */}
      <ResumeTemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        currentTemplate={resumeData.selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* ── AI Polish & Improve Modal ── */}
      <AIImproveModal
        isOpen={aiModalConfig.isOpen}
        onClose={() => setAiModalConfig({ ...aiModalConfig, isOpen: false })}
        originalText={aiModalConfig.originalText}
        contextLabel={aiModalConfig.contextLabel}
        resumeId={selectedResumeId}
        onAcceptSuggestion={handleApplyAiSuggestion}
      />
    </div>
  )
}
