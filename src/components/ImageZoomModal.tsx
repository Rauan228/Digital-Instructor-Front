import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  alt?: string
  onClose: () => void
}

export default function ImageZoomModal({ src, alt = '', onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [scale, setScale] = useState(1)
  const [baseScale, setBaseScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const lastPinch = useRef<{ dist: number; cx: number; cy: number } | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const cont = containerRef.current
    if (!cont) return
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 1.1 : 0.9
      applyZoomAround(delta, e.clientX, e.clientY)
    }
    cont.addEventListener('wheel', onWheelNative, { passive: false })
    return () => cont.removeEventListener('wheel', onWheelNative as EventListener)
  }, [scale, tx, ty, baseScale])

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

  const computeBounds = (s: number) => {
    const cont = containerRef.current
    const img = imgRef.current
    if (!cont || !img) return { minTx: 0, maxTx: 0, minTy: 0, maxTy: 0 }
    const contW = cont.clientWidth
    const contH = cont.clientHeight
    const imgW = img.naturalWidth
    const imgH = img.naturalHeight
    const scaledW = imgW * s
    const scaledH = imgH * s
    let minTx = contW - scaledW
    let maxTx = 0
    let minTy = contH - scaledH
    let maxTy = 0
    if (scaledW <= contW) {
      minTx = maxTx = (contW - scaledW) / 2
    }
    if (scaledH <= contH) {
      minTy = maxTy = (contH - scaledH) / 2
    }
    return { minTx, maxTx, minTy, maxTy }
  }

  const clampTranslate = (s: number, x: number, y: number) => {
    const { minTx, maxTx, minTy, maxTy } = computeBounds(s)
    return {
      x: clamp(x, minTx, maxTx),
      y: clamp(y, minTy, maxTy)
    }
  }

  const initLayout = () => {
    const cont = containerRef.current
    const img = imgRef.current
    if (!cont || !img) return
    const contW = cont.clientWidth
    const contH = cont.clientHeight
    const imgW = img.naturalWidth
    const imgH = img.naturalHeight
    const fit = Math.min(contW / imgW, contH / imgH)
    const nextScale = Math.max(0.1, Math.min(fit, 1))
    setBaseScale(nextScale)
    setScale(nextScale)
    const scaledW = imgW * nextScale
    const scaledH = imgH * nextScale
    const cx = (contW - scaledW) / 2
    const cy = (contH - scaledH) / 2
    setTx(cx)
    setTy(cy)
  }

  const applyZoomAround = (deltaScale: number, cx: number, cy: number) => {
    const cont = containerRef.current
    const img = imgRef.current
    if (!cont || !img) return
    const rect = cont.getBoundingClientRect()
    const prevScale = scale
    const minS = baseScale || 1
    const nextScale = clamp(prevScale * deltaScale, minS, Math.max(minS * 5, 5))

    const dx = (cx - rect.left) - tx
    const dy = (cy - rect.top) - ty
    const k = nextScale / prevScale
    let nextTx = tx - (dx * (k - 1))
    let nextTy = ty - (dy * (k - 1))
    const clamped = clampTranslate(nextScale, nextTx, nextTy)
    setScale(nextScale)
    setTx(clamped.x)
    setTy(clamped.y)
  }


  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      lastPos.current = { x: e.clientX, y: e.clientY }
      setDragging(true)
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dx = pts[0].x - pts[1].x
      const dy = pts[0].y - pts[1].y
      const dist = Math.hypot(dx, dy)
      const cx = (pts[0].x + pts[1].x) / 2
      const cy = (pts[0].y + pts[1].y) / 2
      lastPinch.current = { dist, cx, cy }
    }
  }

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 1 && dragging && lastPos.current) {
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const nextX = tx + dx
      const nextY = ty + dy
      const clamped = clampTranslate(scale, nextX, nextY)
      setTx(clamped.x)
      setTy(clamped.y)
      lastPos.current = { x: e.clientX, y: e.clientY }
    } else if (pointers.current.size === 2 && lastPinch.current) {
      const pts = Array.from(pointers.current.values())
      const dx = pts[0].x - pts[1].x
      const dy = pts[0].y - pts[1].y
      const dist = Math.hypot(dx, dy)
      const delta = dist / (lastPinch.current.dist || dist)
      applyZoomAround(delta, lastPinch.current.cx, lastPinch.current.cy)
      lastPinch.current = { dist, cx: lastPinch.current.cx, cy: lastPinch.current.cy }
    }
  }

  const onPointerUpOrCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) lastPinch.current = null
    if (pointers.current.size === 0) {
      setDragging(false)
      lastPos.current = null
    }
  }

  const resetView = () => {
    const cont = containerRef.current
    const img = imgRef.current
    if (!cont || !img) return
    const contW = cont.clientWidth
    const contH = cont.clientHeight
    const imgW = img.naturalWidth
    const imgH = img.naturalHeight
    const s = baseScale || Math.min(contW / imgW, contH / imgH)
    setScale(s)
    const scaledW = imgW * s
    const scaledH = imgH * s
    setTx((contW - scaledW) / 2)
    setTy((contH - scaledH) / 2)
  }

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onBackdropClick}
    >
      <div
        ref={containerRef}
        className="relative max-w-[95vw] max-h-[90vh] w-[95vw] h-[90vh] overflow-hidden bg-black rounded-lg border border-white/10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrCancel}
        onPointerCancel={onPointerUpOrCancel}
        style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        onDoubleClick={resetView}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="select-none"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: 'top left',
            userSelect: 'none',
            touchAction: 'none',
          }}
          onLoad={initLayout}
        />

        <div className="absolute top-3 left-3 flex gap-2">
          <button className="pill px-3 py-1" onClick={resetView}>Reset</button>
          <button className="pill px-3 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}