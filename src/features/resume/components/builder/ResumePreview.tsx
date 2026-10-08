import { useState } from 'react'
import type { ResumeBuilderData } from '../../types/builder.types'
import TemplateRenderer from '../../templates/TemplateRenderer'
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  data: ResumeBuilderData
  className?: string
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export default function ResumePreview({
  data,
  className,
  isFullscreen = false,
  onToggleFullscreen,
}: Props) {
  const [zoomLevel, setZoomLevel] = useState<number>(0.85)

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))
  const handleResetZoom = () => setZoomLevel(0.85)

  return (
    <div
      className={cn(
        'flex flex-col bg-slate-100 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-900/90 p-4' : 'h-full',
        className
      )}
    >
      {/* ── Preview Toolbar ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Live Preview</span>
          <span className="text-[11px] text-slate-400 font-mono">
            [A4 Standard • {data.selectedTemplate.toUpperCase()}]
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-1"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Document Surface ── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start">
        <div
          id="resume-printable-area"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            width: '210mm',
            minHeight: '297mm',
          }}
          className="bg-white text-slate-900 shadow-xl border border-slate-200/80 rounded-sm transition-transform duration-150 relative print:shadow-none print:border-none print:transform-none print:w-full print:m-0"
        >
          <TemplateRenderer data={data} />
        </div>
      </div>
    </div>
  )
}
