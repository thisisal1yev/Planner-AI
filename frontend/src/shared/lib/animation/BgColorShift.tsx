import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Shifts the background color of <body> (or any selector) based on scroll position.
 * Each entry triggers when its `selector` enters viewport.
 */
export interface BgEntry {
  selector: string
  color: string
}

export function BgColorShift({ entries }: { entries: BgEntry[] }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const triggers: ScrollTrigger[] = []

    entries.forEach((e) => {
      const el = document.querySelector(e.selector)
      if (!el) return
      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(document.body, {
              backgroundColor: e.color,
              duration: 0.9,
              ease: 'power2.inOut',
            })
          }
        },
      })
      triggers.push(t)
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [entries])

  return null
}
