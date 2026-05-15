import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function IntroLoader() {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const blockTopRef = useRef<HTMLDivElement>(null)
  const blockBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = sessionStorage.getItem('planner-intro-played')
    if (seen) {
      setDone(true)
      return
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      sessionStorage.setItem('planner-intro-played', '1')
      setDone(true)
      return
    }

    document.body.style.overflow = 'hidden'

    const counter = { v: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        sessionStorage.setItem('planner-intro-played', '1')
        setDone(true)
      },
    })

    tl.to(counter, {
      v: 100,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.floor(counter.v))
        if (barRef.current) barRef.current.style.width = `${counter.v}%`
      },
    })

    tl.to(
      logoRef.current,
      {
        scale: 0.85,
        opacity: 0.6,
        duration: 0.5,
        ease: 'power2.in',
      },
      '-=0.2'
    )

    tl.to(blockTopRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'expo.inOut',
    })
    tl.to(
      blockBottomRef.current,
      {
        yPercent: 100,
        duration: 1,
        ease: 'expo.inOut',
      },
      '<'
    )
    tl.to(
      logoRef.current,
      {
        opacity: 0,
        duration: 0.5,
      },
      '<'
    )

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={blockTopRef} className="absolute inset-x-0 top-0 h-1/2 bg-navy" />
      <div ref={blockBottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-navy" />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div ref={logoRef} className="flex flex-col items-center">
          <div className="font-serif text-[clamp(72px,14vw,220px)] font-bold leading-none tracking-[-0.04em] text-white">
            Planner<span className="text-aurora">AI</span>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <span
              ref={counterRef}
              className="font-mono text-xl text-white/60 tabular-nums"
            >
              0
            </span>
            <div className="h-px w-48 overflow-hidden bg-white/10">
              <span
                ref={barRef}
                className="block h-full w-0 bg-gradient-to-r from-aurora-violet via-aurora-pink to-aurora-orange"
              />
            </div>
            <span className="font-mono text-xl text-white/60 tabular-nums">100</span>
          </div>
        </div>
      </div>
    </div>
  )
}
