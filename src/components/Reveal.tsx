import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  threshold?: number
}

export default function Reveal({ children, className = '', as = 'div', threshold = 0.15 }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const Component = as as any
  return (
    <Component
      ref={ref as any}
      className={`${className} ${visible ? 'animate-in' : 'opacity-0 translate-y-5'}`}
    >
      {children}
    </Component>
  )
}