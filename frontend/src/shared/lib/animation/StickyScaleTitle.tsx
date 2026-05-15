import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StickyScaleTitleProps {
  children: ReactNode
  className?: string
  /** Min scale at start. */
  from?: number
  /** Max scale at end. */
  to?: number
}

/**
 * Title scales from `from` to `to` as the section scrolls through.
 */
export function StickyScaleTitle({
  children,
  className = '',
  from = 0.65,
  to = 1.05,
}: StickyScaleTitleProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: from, opacity: 0.5 },
        {
          scale: to,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 0.8,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [from, to])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformOrigin: 'left bottom', willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  )
}
