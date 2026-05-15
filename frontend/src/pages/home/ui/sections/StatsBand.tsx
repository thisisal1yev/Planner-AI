import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCountUp, AuroraBackground, ScrollChars } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { v: 12500, suffix: '+', l: 'Sotilgan chiptalar', desc: '6 oy ichida' },
  { v: 98, suffix: '%', l: 'Mamnun tashkilotchilar', desc: 'NPS reytingi' },
  { v: 320, suffix: '+', l: 'Faol vendorlar', desc: 'Tekshirilgan' },
  { v: 14, suffix: '', l: 'Shaharlar', desc: "O'zbekiston bo'ylab" },
]

function BigNumber({ v, suffix, l, desc, idx }: (typeof ITEMS)[0] & { idx: number }) {
  const { ref, value } = useCountUp({ end: v, duration: 3 })
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          delay: idx * 0.08,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [idx])

  return (
    <div ref={wrapRef} className="group relative border-l border-white/15 pl-6 lg:border-l-0 lg:pl-0">
      <div className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/30">0{idx + 1}</div>
      <div className="font-serif text-[clamp(72px,13vw,200px)] font-bold leading-[0.85] tracking-[-0.03em] text-aurora">
        <span ref={ref}>{value.toLocaleString()}</span>
        <span>{suffix}</span>
      </div>
      <div className="mt-6 h-px w-16 origin-left scale-x-100 bg-gradient-to-r from-aurora-violet to-transparent transition-transform duration-700 group-hover:scale-x-[3]" />
      <p className="mt-5 text-lg font-medium text-white">{l}</p>
      <p className="mt-1.5 text-sm text-white/45">{desc}</p>
    </div>
  )
}

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-navy px-[clamp(24px,5vw,80px)] py-32">
      <AuroraBackground intensity="medium" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-24">
          <div className="chip mb-5">Raqamlar tilida</div>
          <ScrollChars
            as="h2"
            className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
          >
            Platforma tezlik bilan o'sib bormoqda
          </ScrollChars>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => (
            <BigNumber key={it.l} {...it} idx={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
