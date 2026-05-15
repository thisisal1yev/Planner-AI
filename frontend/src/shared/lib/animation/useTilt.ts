import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useTilt<T extends HTMLElement = HTMLDivElement>(maxTilt = 8) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(el, {
        rotateY: x * maxTilt * 2,
        rotateX: -y * maxTilt * 2,
        transformPerspective: 800,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    const handleLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power2.out' })
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [maxTilt])

  return ref
}
