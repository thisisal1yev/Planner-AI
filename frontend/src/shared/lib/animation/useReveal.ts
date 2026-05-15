import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  ease?: string
  start?: string
  selector?: string
  once?: boolean
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(opts: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const {
      y = 32,
      duration = 0.9,
      delay = 0,
      stagger = 0.08,
      ease = 'power3.out',
      start = 'top 85%',
      selector,
      once = true,
    } = opts

    const targets = selector ? ref.current.querySelectorAll(selector) : ref.current

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
          },
        }
      )
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
