import { useCallback, useState } from 'react'
import { analyzeAnnotatedMultiple } from '../api'
import type { FileAnalysisResult } from '../types'

type Props = {
  onAnalyzed: (results: FileAnalysisResult[]) => void
}

export default function UploadSection({ onAnalyzed }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) setFiles(droppedFiles)
  }, [])

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) setFiles(selectedFiles)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onAnalyze = async () => {
    if (files.length === 0) return
    setLoading(true)
    setError(null)
    setProgress({ current: 0, total: files.length })
    
    try {
      const BATCH_SIZE = 5
      const allResults: FileAnalysisResult[] = []
      
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE)
        setProgress({ current: i, total: files.length })
        
        try {
          const res = await analyzeAnnotatedMultiple(batch)
          allResults.push(...res.files)
          
          onAnalyzed([...allResults])
          
          if (i + BATCH_SIZE < files.length) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (batchError: any) {
          console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, batchError)
          setError(`Warning: Batch ${i / BATCH_SIZE + 1} failed. Continuing...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      
      setProgress({ current: files.length, total: files.length })
    } catch (err: any) {
      setError(err?.message || 'Analysis failed')
    } finally {
      setLoading(false)
      setTimeout(() => setProgress({ current: 0, total: 0 }), 1000)
    }
  }

  const totalSize = files.reduce((acc, f) => acc + f.size, 0)

  return (
    <div className="glass rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <h2 className="text-xl md:text-2xl font-semibold">Upload & Analyze</h2>
      <p className="text-subtle text-sm mt-1">Supported formats: PDF, PNG, JPG • Multiple files allowed</p>

      <div
        className={`mt-4 rounded-xl p-8 text-center transition ${
          isDragging ? 'bg-accent/10' : 'bg-white/5'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <p className="text-subtle">
          Drag documents here or choose files to upload
        </p>
        <label className="inline-block pill mt-4 px-5 py-2 bg-white text-black font-semibold cursor-pointer shadow-glow">
          Choose Files
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            className="hidden"
            onChange={onFileSelect}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">
              {files.length} file{files.length > 1 ? 's' : ''} selected • {(totalSize / 1024).toFixed(1)} KB
            </div>
            <button
              className="text-sm text-subtle hover:text-white"
              onClick={() => setFiles([])}
            >
              Clear all
            </button>
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
              >
                <div className="text-sm text-subtle flex-1 truncate">
                  <span className="font-mono">{file.name}</span>
                  <span className="ml-2 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  className="ml-2 text-red-400 hover:text-red-300 text-sm"
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {loading && progress.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-subtle mb-2">
                <span>Processing files...</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-300 ease-out"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <button
            className="w-full pill mt-4 px-5 py-3 bg-white text-black font-semibold shadow-glow disabled:opacity-60 transition-opacity"
            onClick={onAnalyze}
            disabled={loading}
          >
            {loading ? `Analyzing... (${progress.current}/${progress.total})` : `Analyze ${files.length} file${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-300 text-sm">{error}</div>
      )}
    </div>
  )
}