import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Upload } from 'lucide-react'
import FileUploader from '../components/FileUploader'
import { useUploadResume } from '../hooks/useResume'
import { Button } from '../components/ResumeUI'

export default function ResumeUpload() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadDone, setUploadDone] = useState(false)
  const uploadMutation = useUploadResume()

  // Simulate progress animation while uploading
  useEffect(() => {
    if (!uploadMutation.isPending) return
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.floor(Math.random() * 8) + 5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [uploadMutation.isPending])

  const handleUpload = async () => {
    if (!selectedFile) return
    try {
      await uploadMutation.mutateAsync(selectedFile)
      console.log('[Resume] Resume upload successful')
      setUploadProgress(100)
      setUploadDone(true)
      setTimeout(() => navigate('/resume', { replace: true }), 1500)
    } catch {
      // error handled by mutation
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-black text-2xl text-foreground mb-1">Upload Resume</h1>
        <p className="text-sm text-muted-foreground">
          Upload your PDF or DOCX resume. We'll parse, analyze, and evaluate it instantly.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6"
      >
        {uploadDone ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Upload Successful!</h3>
              <p className="text-sm text-muted-foreground mt-1">Redirecting to resume details...</p>
            </div>
          </div>
        ) : (
          <>
            <FileUploader
              onFileSelect={setSelectedFile}
              isUploading={uploadMutation.isPending}
              uploadProgress={uploadProgress}
            />

            {uploadMutation.isError && (
              <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl text-sm text-danger">
                Upload failed. Please try again.
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                loading={uploadMutation.isPending}
                size="lg"
                className="flex-1"
              >
                <Upload className="w-4 h-4" />
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Resume'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/resume')}
                disabled={uploadMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
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
