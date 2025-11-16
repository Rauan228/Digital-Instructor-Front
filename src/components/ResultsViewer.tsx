import { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import type { AnalyzeResponse, PageResult, Detection } from '../types'
import ImageZoomModal from './ImageZoomModal'

type Props = {
  response: AnalyzeResponse
}

const PageThumb = memo(({ 
  page, 
  index, 
  isActive, 
  onClick 
}: { 
  page: PageResult
  index: number
  isActive: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`text-left rounded-lg overflow-hidden ${
      isActive ? 'shadow-[0_0_20px_rgba(125,211,252,0.25)]' : ''
    }`}
  >
    {page.image_base64 ? (
      <img
        src={`data:image/jpeg;base64,${page.image_base64}`}
        alt={`Page ${page.page_index}`}
        className="block w-full"
        loading="lazy"
      />
    ) : (
      <div className="p-3 text-subtle text-sm">No preview</div>
    )}
  </button>
))

PageThumb.displayName = 'PageThumb'

function ResultsViewer({ response }: Props) {
  const [current, setCurrent] = useState(0)
  const [focusedObject, setFocusedObject] = useState<Detection | null>(null)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const zoomImageRef = useRef<HTMLImageElement>(null)
  const pages = response.pages

  const currentPage: PageResult | undefined = useMemo(() => pages[current], [pages, current])
  const visibleObjects = useMemo(() => {
    return currentPage?.objects.filter(o => o.class.toLowerCase() !== 'signauth') ?? []
  }, [currentPage])

  useEffect(() => {
    setFocusedObject(null)
    setZoomOpen(false)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }, [current])

  useEffect(() => {
    if (!focusedObject) return

    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setFocusedObject(prev => prev ? { ...prev } : null)
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [focusedObject])

  const downloadJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${response.file_name.replace(/\.[^.]+$/, '')}-analysis.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [response])

  const handleObjectClick = useCallback((obj: Detection) => {
    setFocusedObject(prev => prev === obj ? null : obj)
    setZoomOpen(false)
  }, [])

  const handleZoomWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setZoomLevel(prev => Math.max(1, Math.min(5, prev + delta)))
  }, [])

  const handlePanStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    setDragStart({ x: clientX - panPosition.x, y: clientY - panPosition.y })
  }, [panPosition])

  const handlePanMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    setPanPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    })
  }, [isDragging, dragStart])

  const handlePanEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    handlePanStart(e.clientX, e.clientY)
  }, [handlePanStart])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handlePanMove(e.clientX, e.clientY)
  }, [handlePanMove])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      ;(e.currentTarget as any).dataset.initialDistance = distance
      ;(e.currentTarget as any).dataset.initialZoom = zoomLevel
    } else if (e.touches.length === 1) {
      handlePanStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }, [zoomLevel, handlePanStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      const initialDistance = parseFloat((e.currentTarget as any).dataset.initialDistance || '1')
      const initialZoom = parseFloat((e.currentTarget as any).dataset.initialZoom || '1')
      const scale = distance / initialDistance
      setZoomLevel(Math.max(1, Math.min(5, initialZoom * scale)))
    } else if (e.touches.length === 1) {
      e.preventDefault()
      handlePanMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }, [handlePanMove])

  const handleTouchEnd = useCallback(() => {
    handlePanEnd()
  }, [handlePanEnd])

  useEffect(() => {
    if (!zoomOpen) return
    const container = zoomImageRef.current?.parentElement
    if (!container) return
    
    const handler = (e: WheelEvent) => handleZoomWheel(e)
    container.addEventListener('wheel', handler, { passive: false })
    return () => container.removeEventListener('wheel', handler)
  }, [zoomOpen, handleZoomWheel])

  const getClassEmoji = (className: string): string => {
    const emojiMap: Record<string, string> = {
      'stamp': '🔖',
      'qr': '🔲',
      'signature': '✍️',
      'auth': '👤',
      'signauth': '🟦'
    }
    return emojiMap[className.toLowerCase()] || '📦'
  }

  const showSidebar = pages.length > 1

  const focusBoxData = useMemo(() => {
    if (!focusedObject || !currentPage || !imageRef.current) {
      return null
    }

    const img = imageRef.current
    const imgRect = img.getBoundingClientRect()
    const containerRect = img.parentElement?.getBoundingClientRect()
    
    if (!containerRect) return null

    const scaleX = imgRect.width / currentPage.width
    const scaleY = imgRect.height / currentPage.height

    const [x, y, w, h] = focusedObject.bbox
    const scaledX = x * scaleX
    const scaledY = y * scaleY
    const scaledW = w * scaleX
    const scaledH = h * scaleY

    const offsetX = imgRect.left - containerRect.left
    const offsetY = imgRect.top - containerRect.top

    const left = offsetX + scaledX
    const top = offsetY + scaledY

    return {
      left,
      top,
      width: scaledW,
      height: scaledH,
      clipPath: `polygon(
        0% 0%, 
        0% 100%, 
        ${left}px 100%, 
        ${left}px ${top}px, 
        ${left + scaledW}px ${top}px, 
        ${left + scaledW}px ${top + scaledH}px, 
        ${left}px ${top + scaledH}px, 
        ${left}px 100%, 
        100% 100%, 
        100% 0%
      )`
    }
  }, [focusedObject, currentPage, imageRef.current])

  return (
    <div className={showSidebar ? "grid md:grid-cols-[220px,1fr] gap-6" : "grid gap-6"}>
      {showSidebar && (
        <div className="glass rounded-xl p-3 max-h-[520px] overflow-auto">
          <div className="text-sm font-semibold mb-2">Pages ({pages.length})</div>
          <div className="flex flex-col gap-3">
            {pages.map((p, i) => (
              <PageThumb
                key={`page-${p.page_index}`}
                page={p}
                index={i}
                isActive={current === i}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <div className="glass rounded-xl p-3 relative overflow-hidden">
          {currentPage?.image_base64 ? (
            <>
              <img
                ref={imageRef}
                src={`data:image/jpeg;base64,${currentPage.image_base64}`}
                alt={`Page ${currentPage.page_index}`}
                className="max-h-[520px] w-auto mx-auto block cursor-zoom-in"
                id="page-preview-image"
                loading="lazy"
                onClick={() => setZoomOpen(true)}
              />
              
              {focusedObject && currentPage && focusBoxData && (
                <div 
                  className="absolute inset-0 focus-overlay cursor-pointer"
                  onClick={() => setFocusedObject(null)}
                  style={{ willChange: 'opacity' }}
                >
                  <div 
                    className="absolute inset-0 bg-black/80"
                    style={{
                      clipPath: focusBoxData.clipPath,
                      willChange: 'clip-path'
                    }}
                  />
                  
                  <div 
                    className="absolute focus-box pointer-events-none"
                    style={{
                      left: `${focusBoxData.left}px`,
                      top: `${focusBoxData.top}px`,
                      width: `${focusBoxData.width}px`,
                      height: `${focusBoxData.height}px`,
                      willChange: 'transform'
                    }}
                  >
                    <div className="absolute inset-0 border-4 border-cyan-400 shadow-[0_0_40px_rgba(125,211,252,0.6)] rounded-lg animate-pulse-border">
                      <div className="absolute -top-10 left-0 bg-cyan-400 text-black px-3 py-1 rounded-md text-base font-semibold whitespace-nowrap pointer-events-auto">
                        {focusedObject.class} ({(focusedObject.confidence * 100).toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {zoomOpen && (
                <div 
                  className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                  onMouseUp={handlePanEnd}
                  onTouchEnd={handleTouchEnd}
                  style={{ touchAction: 'none' }}
                >
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold"
                    >
                      −
                    </button>
                    <div className="px-4 py-2 bg-white/10 rounded-lg text-white font-mono">
                      {(zoomLevel * 100).toFixed(0)}%
                    </div>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.5))}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setZoomLevel(1)
                        setPanPosition({ x: 0, y: 0 })
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setZoomOpen(false)}
                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div 
                    className="relative w-full h-full overflow-hidden flex items-center justify-center"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                  >
                    <img
                      ref={zoomImageRef}
                      src={`data:image/jpeg;base64,${currentPage.image_base64}`}
                      alt={`Page ${currentPage.page_index} - Zoomed`}
                      className="select-none"
                      draggable={false}
                      style={{
                        transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        maxHeight: '85vh',
                        maxWidth: '90vw',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                    />
                  </div>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
                    <span className="hidden md:inline">Колесико мыши - зум | Перетащите - движение</span>
                    <span className="md:hidden">Pinch - зум | Перетащите - движение</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-subtle">No image to display</div>
          )}
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-subtle">File</div>
              <div className="font-mono text-sm">{response.file_name}</div>
            </div>
            <button onClick={downloadJSON} className="pill px-4 py-2 hover:bg-white/10">
              Download JSON
            </button>
          </div>
          <div className="mt-4">
            <div className="text-base font-semibold mb-3">Objects on the current page</div>
            <div className="mt-2 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleObjects.map((o, idx) => {
                const isActive = focusedObject === o
                return (
                  <button
                    key={`obj-${idx}-${o.class}-${o.bbox[0]}`}
                    onClick={() => handleObjectClick(o)}
                    className={`rounded-lg p-4 transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_20px_rgba(125,211,252,0.4)]' 
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-cyan-400/30'
                    }`}
                  >
                    <div className="text-base font-medium">
                      <span className="text-subtle">class:</span> {getClassEmoji(o.class)} {o.class}
                    </div>
                    <div className="text-base">
                      <span className="text-subtle">confidence:</span> {o.confidence.toFixed(2)}
                    </div>
                    <div className="text-sm text-subtle">
                      bbox: [{o.bbox.join(', ')}]
                    </div>
                  </button>
                )
              })}
              {!visibleObjects.length && (
                <div className="text-subtle text-base">No detections on page</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ResultsViewer)