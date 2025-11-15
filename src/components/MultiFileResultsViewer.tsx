import { useState, useEffect, useMemo, memo } from 'react'
import type { FileAnalysisResult } from '../types'
import ResultsViewer from './ResultsViewer'

type Props = {
  results: FileAnalysisResult[]
}

// Мемоизированный компонент для кнопки файла
const FileButton = memo(({ 
  file, 
  idx, 
  isActive, 
  onClick 
}: { 
  file: FileAnalysisResult
  idx: number
  isActive: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`text-left rounded-lg p-3 transition-all duration-200 ${
      isActive
        ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_20px_rgba(125,211,252,0.4)]'
        : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-cyan-400/30'
    }`}
  >
    <div className="font-mono text-sm truncate">{file.file_name}</div>
    <div className="text-xs text-subtle mt-1">
      {file.pages.length} page{file.pages.length !== 1 ? 's' : ''}
    </div>
  </button>
))

FileButton.displayName = 'FileButton'

export default function MultiFileResultsViewer({ results }: Props) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [page, setPage] = useState(0)
  
  const FILES_PER_PAGE = 12

  // Сбрасываем индекс при изменении списка файлов
  useEffect(() => {
    setSelectedFileIndex(0)
    setPage(0)
  }, [results])

  if (results.length === 0) {
    return null
  }

  // Защита от выхода за границы массива
  const safeIndex = Math.min(selectedFileIndex, results.length - 1)
  const currentFile = results[safeIndex]

  // Пагинация
  const totalPages = Math.ceil(results.length / FILES_PER_PAGE)
  const startIdx = page * FILES_PER_PAGE
  const endIdx = Math.min(startIdx + FILES_PER_PAGE, results.length)
  const visibleFiles = useMemo(() => results.slice(startIdx, endIdx), [results, startIdx, endIdx])

  const goToPage = (newPage: number) => {
    setPage(Math.max(0, Math.min(newPage, totalPages - 1)))
  }

  return (
    <div className="space-y-6">
      {/* Селектор файлов - показываем только если больше одного файла */}
      {results.length > 1 && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">
              Analyzed Files ({results.length})
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-subtle">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages - 1}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {visibleFiles.map((file, localIdx) => {
              const globalIdx = startIdx + localIdx
              return (
                <FileButton
                  key={`file-${globalIdx}-${file.file_name}`}
                  file={file}
                  idx={globalIdx}
                  isActive={safeIndex === globalIdx}
                  onClick={() => setSelectedFileIndex(globalIdx)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Результаты для выбранного файла */}
      {currentFile && <ResultsViewer key={`file-${safeIndex}-${currentFile.file_name}`} response={currentFile} />}
    </div>
  )
}

