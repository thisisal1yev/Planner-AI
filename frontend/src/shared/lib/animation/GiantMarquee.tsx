import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GiantMarqueeProps {
  text: string
  speed?: number
  className?: string
  /** Whether words magnify on hover. */
  hoverZoom?: boolean
}

export function GiantMarquee({
  text,
  speed = 50,
  className = '',
  hoverZoom = true,
}: GiantMarqueeProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollDir, setScrollDir] = useState<1 | -1>(1)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth / 2
      const baseTween = gsap.to(trackRef.current, {
        x: -distance,
        duration: distance / speed,
        ease: 'none',
        repeat: -1,
      })

      let lastY = window.scrollY
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => {
          const y = window.scrollY
          const dir = y > lastY ? 1 : -1
          if (dir !== scrollDir) setScrollDir(dir as 1 | -1)
          lastY = y
          // boost speed when scrolling, ease back when idle
          gsap.to(baseTween, { timeScale: dir === 1 ? 2.4 : -2.4, duration: 0.4, overwrite: true })
        },
        onLeave: () => gsap.to(baseTween, { timeScale: 1, duration: 0.6, overwrite: true }),
        onEnterBack: () => gsap.to(baseTween, { timeScale: -1, duration: 0.6, overwrite: true }),
      })

      let idleTimer: number
      const resetIdle = () => {
        clearTimeout(idleTimer)
        idleTimer = window.setTimeout(() => {
          gsap.to(baseTween, { timeScale: 1, duration: 1, overwrite: true })
        }, 200)
      }
      window.addEventListener('scroll', resetIdle, { passive: true })

      return () => {
        window.removeEventListener('scroll', resetIdle)
        clearTimeout(idleTimer)
        st.kill()
      }
    }, sectionRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const words = text.split(' • ')
  const items = [...words, ...words, ...words, ...words]

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden py-10 ${className}`}
      style={{ background: 'transparent' }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap gap-12">
        {items.map((w, i) => (
          <span
            key={i}
            className={`font-serif text-[clamp(60px,12vw,200px)] font-bold leading-[0.9] tracking-[-0.035em] text-white/95 transition-all duration-300 ${
              hoverZoom ? 'hover:text-aurora hover:scale-110 inline-block' : ''
            }`}
            style={{ transformOrigin: 'center center' }}
          >
            {w}
            <span className="ml-12 inline-block text-aurora align-middle text-[0.5em]">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
