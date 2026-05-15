import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CountUpOptions {
  end: number
  duration?: number
  start?: string
  decimals?: number
}

export function useCountUp({ end, duration = 2, start = 'top 85%', decimals = 0 }: CountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(end)
      return
    }

    const obj = { v: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: end,
        duration,
        ease: 'power2.out',
        onUpdate: () => setValue(obj.v),
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none none',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [end, duration, start])

  return {
    ref,
    value: decimals ? value.toFixed(decimals) : Math.round(value),
  }
}
