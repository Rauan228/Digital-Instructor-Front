import { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import type { AnalyzeResponse, PageResult, Detection } from '../types'

type Props = {
  response: AnalyzeResponse
}

// Мемоизированный компонент для кнопки страницы
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
  const imageRef = useRef<HTMLImageElement>(null)
  const pages = response.pages

  const currentPage: PageResult | undefined = useMemo(() => pages[current], [pages, current])

  // Сброс фокуса при смене страницы
  useEffect(() => {
    setFocusedObject(null)
  }, [current])

  // Оптимизированный обработчик resize с debounce
  useEffect(() => {
    if (!focusedObject) return

    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        // Просто принудительно вызываем перерасчет
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
  }, [])

  // Получить эмодзи для класса объекта
  const getClassEmoji = (className: string): string => {
    const emojiMap: Record<string, string> = {
      'stamp': '🔖',
      'qr': '🔲',
      'signature': '✍️'
    }
    return emojiMap[className.toLowerCase()] || '📦'
  }

  // Показывать боковую панель только если больше одной страницы
  const showSidebar = pages.length > 1

  // Рассчитываем позицию и размер фокус-бокса (мемоизировано для производительности)
  const focusBoxData = useMemo(() => {
    if (!focusedObject || !currentPage || !imageRef.current) {
      return null
    }

    const img = imageRef.current
    const imgRect = img.getBoundingClientRect()
    const containerRect = img.parentElement?.getBoundingClientRect()
    
    if (!containerRect) return null

    // Масштаб отображаемого изображения относительно оригинала
    const scaleX = imgRect.width / currentPage.width
    const scaleY = imgRect.height / currentPage.height

    // Координаты bbox в масштабе отображаемого изображения
    const [x, y, w, h] = focusedObject.bbox
    const scaledX = x * scaleX
    const scaledY = y * scaleY
    const scaledW = w * scaleX
    const scaledH = h * scaleY

    // Смещение изображения относительно контейнера (из-за mx-auto)
    const offsetX = imgRect.left - containerRect.left
    const offsetY = imgRect.top - containerRect.top

    const left = offsetX + scaledX
    const top = offsetY + scaledY

    return {
      left,
      top,
      width: scaledW,
      height: scaledH,
      // Для clip-path вычисляем процентные значения
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
      {/* Список страниц - показываем только если больше одной страницы */}
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

      {/* Превью и объекты */}
      <div className="grid gap-6">
        <div className="glass rounded-xl p-3 relative overflow-hidden">
          {currentPage?.image_base64 ? (
            <>
              <img
                ref={imageRef}
                src={`data:image/jpeg;base64,${currentPage.image_base64}`}
                alt={`Page ${currentPage.page_index}`}
                className="max-h-[520px] w-auto mx-auto block"
                id="page-preview-image"
                loading="lazy"
              />
              
              {/* Overlay для фокуса */}
              {focusedObject && currentPage && focusBoxData && (
                <div 
                  className="absolute inset-0 focus-overlay cursor-pointer"
                  onClick={() => setFocusedObject(null)}
                  style={{ willChange: 'opacity' }}
                >
                  {/* Затемнение с вырезом (без блюра внутри bbox) */}
                  <div 
                    className="absolute inset-0 bg-black/80"
                    style={{
                      clipPath: focusBoxData.clipPath,
                      willChange: 'clip-path'
                    }}
                  />
                  
                  {/* Рамка вокруг объекта */}
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
              {currentPage?.objects.map((o, idx) => {
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
              {!currentPage?.objects?.length && (
                <div className="text-subtle text-base">No detections on page</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Экспортируем мемоизированную версию
export default memo(ResultsViewer)