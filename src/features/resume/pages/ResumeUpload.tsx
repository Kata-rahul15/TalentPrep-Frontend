import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import FileUploader from '../components/FileUploader'
import { useResumeContext } from '../context/ResumeContext'
import { Button } from '../components/ResumeUI'

export default function ResumeUpload() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { startUpload, activeUpload } = useResumeContext()

  const isUploadingOrProcessing =
    activeUpload.status === 'uploading' || activeUpload.status === 'processing'

  const handleUpload = async () => {
    if (!selectedFile || isUploadingOrProcessing) return
    try {
      await startUpload(selectedFile)
    } catch {
      // Error handled by modal
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-black text-2xl text-foreground mb-1">
          Upload Resume
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload your PDF or DOCX resume. We'll parse, analyze, and evaluate it using AI.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <FileUploader
          onFileSelect={setSelectedFile}
          isUploading={isUploadingOrProcessing}
          uploadProgress={activeUpload.uploadProgress}
        />

        {activeUpload.status === 'failed' && activeUpload.error && (
          <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl text-sm text-danger">
            {activeUpload.error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploadingOrProcessing}
            loading={isUploadingOrProcessing}
            size="lg"
            className="flex-1"
          >
            <Upload className="w-4 h-4" />
            {isUploadingOrProcessing ? 'Processing Resume...' : 'Upload Resume'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/resume')}
            disabled={isUploadingOrProcessing}
          >
            Cancel
          </Button>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/5 border border-primary/20 rounded-2xl p-5"
      >
        <h3 className="font-semibold text-sm text-primary mb-3">Tips for a better ATS score</h3>
        <ul className="space-y-1.5 text-xs text-secondary-foreground">
          {[
            'Use a single-column layout — multi-column resumes confuse most ATS parsers.',
            'Avoid headers, footers, tables, and text boxes — use simple sections.',
            'Include full job title keywords matching the roles you\'re applying for.',
            'Keep file names clean: FirstName_LastName_Resume.pdf works best.',
            'Ensure your contact details (email, phone, LinkedIn) are at the top.',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
