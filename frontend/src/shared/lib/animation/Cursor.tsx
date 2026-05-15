import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' })
    const rxTo = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
    const ryTo = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      rxTo(e.clientX)
      ryTo(e.clientY)
    }

    const handleEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        gsap.to(ring, { scale: 1.6, opacity: 0.7, duration: 0.3 })
        gsap.to(dot, { scale: 0.5, duration: 0.3 })
      }
    }

    const handleLeave = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 })
        gsap.to(dot, { scale: 1, duration: 0.3 })
      }
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', handleEnter)
    document.addEventListener('mouseout', handleLeave)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', handleEnter)
      document.removeEventListener('mouseout', handleLeave)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 mix-blend-difference md:block"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary mix-blend-difference md:block"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
