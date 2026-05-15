import { useEffect, useRef, type ReactNode, type ElementType } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplitTextRevealProps {
  children: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  y?: number
  trigger?: 'mount' | 'scroll'
  splitBy?: 'word' | 'char'
}

export function SplitTextReveal({
  children,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.04,
  duration = 0.9,
  y = 60,
  trigger = 'mount',
  splitBy = 'word',
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const units = ref.current.querySelectorAll<HTMLElement>('[data-split-unit]')
    if (!units.length) return

    const ctx = gsap.context(() => {
      gsap.set(units, { y, opacity: 0, rotate: 4 })

      const config: gsap.TweenVars = {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration,
        delay,
        stagger,
        ease: 'power4.out',
      }

      if (trigger === 'scroll') {
        config.scrollTrigger = {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }

      gsap.to(units, config)
    }, ref)

    return () => ctx.revert()
  }, [delay, duration, stagger, y, trigger, children])

  const tokens =
    splitBy === 'char'
      ? children.split('')
      : children.split(/(\s+)/)

  return (
    <Tag ref={ref as never} className={className}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-baseline"
            style={{ verticalAlign: 'baseline' }}
          >
            <span data-split-unit className="inline-block will-change-transform">
              {token}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}

interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

export function LineReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.9,
  y = 28,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [delay, duration, y])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  )
}
