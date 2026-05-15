import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { useMagnetic, useCountUp, AuroraBackground, FloatingOrbs } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { v: 500, suffix: '+', l: 'Tadbirlar' },
  { v: 120, suffix: '+', l: 'Maydonlar' },
  { v: 80, suffix: '+', l: 'Xizmatlar' },
  { v: 10, suffix: 'K+', l: 'Ishtirokchilar' },
]

function Stat({ v, suffix, l }: (typeof STATS)[0]) {
  const { ref, value } = useCountUp({ end: v, duration: 2.6 })
  return (
    <div className="flex flex-col gap-1.5 border-l border-white/15 pl-5">
      <div className="font-serif text-4xl font-bold leading-none tracking-tight text-aurora md:text-5xl">
        <span ref={ref}>{value}</span>
        <span>{suffix}</span>
      </div>
      <div className="text-[10px] tracking-[0.24em] uppercase text-white/45">{l}</div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const primaryCtaRef = useMagnetic<HTMLAnchorElement>(0.3)
  const outlineCtaRef = useMagnetic<HTMLAnchorElement>(0.3)
  const bgRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headlineRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        const chars = headlineRef.current!.querySelectorAll('[data-char]')
        gsap.set(chars, { yPercent: 110, opacity: 0, rotate: 8 })
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.022,
          delay: 0.2,
        })

        gsap.to(bgRef.current, {
          yPercent: 35,
          scale: 1.2,
          opacity: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1,
          },
        })

        gsap.to(headlineRef.current, {
          yPercent: -20,
          opacity: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })

        // Scroll-driven char scatter as user scrolls past Hero
        const heroChars = headlineRef.current!.querySelectorAll('[data-char]')
        heroChars.forEach((c, i) => {
          gsap.to(c, {
            x: (i % 2 === 0 ? -1 : 1) * (40 + (i % 5) * 25),
            y: (i % 3 === 0 ? -1 : 1) * (20 + (i % 4) * 15),
            rotate: (i % 2 === 0 ? -1 : 1) * (10 + (i % 6) * 4),
            opacity: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'center top',
              end: 'bottom top',
              scrub: 1.5,
            },
          })
        })

        gsap.to(subRef.current, {
          yPercent: -40,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom 60%',
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-navy"
    >
      <div ref={bgRef} className="absolute inset-0">
        <AuroraBackground intensity="high" />
        <FloatingOrbs count={6} />
      </div>
      <div className="grain absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-navy/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-navy to-transparent" />

      <div className="relative z-20 w-full px-[clamp(24px,5vw,80px)] py-32">
        <div className="mx-auto max-w-[1800px]">
          <div className="mb-12 inline-flex animate-[lp-up_0.9s_ease-out_forwards] items-center gap-3 rounded-full border border-white/12 bg-white/5 px-5 py-2 backdrop-blur-md opacity-0 [animation-delay:0.05s]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-[pulse-ring_2s_ease-out_infinite] rounded-full bg-aurora-pink" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-pink" />
            </span>
            <Sparkles className="size-3.5 text-aurora-violet" />
            <span className="text-xs tracking-[0.18em] uppercase text-white/75">
              O'zbekistondagi №1 tadbirlar marketi
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="mb-10 font-serif text-[clamp(54px,10vw,160px)] font-bold leading-[0.92] tracking-[-0.035em] text-white"
          >
            <span className="block overflow-hidden">
              {'Tadbirlarni'.split('').map((c, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span data-char className="inline-block will-change-transform">
                    {c}
                  </span>
                </span>
              ))}
            </span>
            <span className="block overflow-hidden">
              <em className="inline-block not-italic text-aurora">
                {'muommosiz'.split('').map((c, i) => (
                  <span key={i} className="inline-block overflow-hidden">
                    <span data-char className="inline-block will-change-transform">
                      {c}
                    </span>
                  </span>
                ))}
              </em>
            </span>
            <span className="block overflow-hidden">
              {'tashkil eting'.split('').map((c, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span data-char className="inline-block will-change-transform">
                    {c === ' ' ? ' ' : c}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div ref={subRef} className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
            <p className="col-span-1 max-w-2xl animate-[lp-up_0.9s_ease-out_forwards] text-xl leading-[1.5] text-white/65 opacity-0 [animation-delay:1.4s] lg:col-span-6">
              Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Planner AI tashkilotchilarga
              tadbirlarni tez va samarali ishga tushirishga yordam beradi.
            </p>

            <div className="col-span-1 flex animate-[lp-up_0.9s_ease-out_forwards] flex-col gap-4 opacity-0 [animation-delay:1.6s] lg:col-span-6 lg:items-end">
              <div className="flex flex-wrap gap-3">
                <Link ref={primaryCtaRef} to="/events" className="group btn-primary">
                  <span className="relative z-10">Tadbirlarni ko'rish</span>
                  <ArrowRight className="relative z-10 ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link ref={outlineCtaRef} to="/register" className="group btn-outline">
                  <Play className="mr-2 size-3.5 fill-current opacity-80" />
                  <span>Demo ko'rish</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-24 grid animate-[lp-up_0.9s_ease-out_forwards] grid-cols-2 gap-6 opacity-0 [animation-delay:1.8s] sm:grid-cols-4">
            {STATS.map((s) => (
              <Stat key={s.l} {...s} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-[lp-up_0.9s_ease-out_forwards] opacity-0 [animation-delay:2.2s]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">Scroll</span>
          <div className="relative h-12 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-line_2.2s_ease-in-out_infinite] bg-aurora-violet" />
          </div>
        </div>
      </div>
    </section>
  )
}
