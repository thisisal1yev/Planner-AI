import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Pin section + scrubbed animation along its scroll length. */
export function usePinScroll<T extends HTMLElement = HTMLDivElement>(
  build: (el: T, st: typeof ScrollTrigger) => void,
  deps: unknown[] = []
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      build(ref.current!, ScrollTrigger)
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/** Clip-path reveal on scroll (image, video, large block). */
export function useClipReveal<T extends HTMLElement = HTMLDivElement>(
  direction: 'left' | 'right' | 'up' | 'down' = 'up'
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const map = {
      up: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
      down: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
      left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
      right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    }[direction]

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { clipPath: map.from },
        {
          clipPath: map.to,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [direction])

  return ref
}

/** Parallax: element shifts proportional to scroll. */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 100 * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [speed])

  return ref
}

/** Text fades in line-by-line as scrubbed by scroll position. */
export function useScrubText<T extends HTMLElement = HTMLDivElement>(selector = 'span[data-word]') {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const words = ref.current.querySelectorAll(selector)
    if (!words.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [selector])

  return ref
}

/** Scale + fade up on scroll enter. */
export function useScaleIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: 0.85, opacity: 0, y: 60 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [])

  return ref
}

/** Horizontal scroll inside pinned container. */
export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !trackRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - window.innerWidth
      gsap.to(trackRef.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return { ref, trackRef }
}
