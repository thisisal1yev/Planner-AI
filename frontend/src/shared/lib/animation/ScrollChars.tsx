import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollCharsProps {
  children: string | ReactNode
  as?: ElementType
  className?: string
  /** Lowest opacity for dimmed chars (default 0.1). */
  dim?: number
  /** Scroll range. */
  start?: string
  end?: string
  /** Pixel range relative to top of element instead of viewport. */
  scrub?: number | boolean
}

/**
 * madewithgsap.com-style scrub reveal:
 * each character starts dim, fades to full opacity as user scrolls through.
 */
export function ScrollChars({
  children,
  as: Tag = 'span',
  className = '',
  dim = 0.1,
  start = 'top 85%',
  end = 'bottom 60%',
  scrub = 1,
}: ScrollCharsProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const targets = ref.current.querySelectorAll<HTMLElement>('[data-sc-char]')
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: dim, color: '#5a5a72' },
        {
          opacity: 1,
          color: '#ffffff',
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [dim, start, end, scrub])

  const text = typeof children === 'string' ? children : ''
  if (!text && children) {
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    )
  }

  const words = text.split(/(\s+)/)

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) return <span key={wi}>{word}</span>
        return (
          <span key={wi} className="inline-block">
            {word.split('').map((c, ci) => (
              <span
                key={ci}
                data-sc-char
                className="inline-block"
                style={{ willChange: 'opacity, color' }}
              >
                {c}
              </span>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}
