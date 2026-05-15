import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Wrench, Ticket } from 'lucide-react'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    t: 'Maydon tanlang',
    d: "Butun O'zbekiston bo'ylab yuzlab tekshirilgan maydonlardan tadbiringiz uchun ideal joyni toping. Real vaqtdagi mavjudlik, narxlar va sharhlar.",
    Icon: MapPin,
    color: 'from-aurora-cyan to-aurora-blue',
  },
  {
    n: '02',
    t: "Xizmatlar qo'shing",
    d: "Katering, bezak, ovoz, foto — tekshirilgan ta'minotchilardan hamma zarur narsalarni bir joyda buyurtma qiling.",
    Icon: Wrench,
    color: 'from-aurora-violet to-aurora-pink',
  },
  {
    n: '03',
    t: 'Chiptalar soting',
    d: 'Chipta sotuvini ishga tushiring, ishtirokchilarni boshqaring va real vaqtda analitikani kuzating. Click va Payme integratsiyasi.',
    Icon: Ticket,
    color: 'from-aurora-pink to-aurora-orange',
  },
]

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const visualRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 30%',
            end: 'bottom 70%',
            scrub: 0.5,
          },
        }
      )

      stepRefs.current.forEach((step, i) => {
        if (!step) return
        gsap.fromTo(
          step,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => activateVisual(i),
          onEnterBack: () => activateVisual(i),
        })
      })
    }, containerRef)

    function activateVisual(i: number) {
      visualRefs.current.forEach((v, idx) => {
        if (!v) return
        gsap.to(v, {
          opacity: idx === i ? 1 : 0,
          scale: idx === i ? 1 : 0.85,
          rotate: idx === i ? 0 : -6,
          duration: 0.8,
          ease: 'power3.out',
        })
      })
    }

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-navy-2 px-[clamp(24px,5vw,80px)] py-32"
    >
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-20 grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 md:col-span-8">
            <div className="chip mb-5">Jarayon</div>
            <ScrollChars
              as="h2"
              className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
            >
              Bu qanday ishlaydi
            </ScrollChars>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="flex items-baseline gap-3 md:justify-end">
              <span className="font-serif text-7xl font-bold leading-none tracking-tight text-aurora">
                03
              </span>
              <span className="text-sm text-white/45">qadam</span>
            </div>
            <p className="mt-4 max-w-sm text-base text-white/55 md:ml-auto">
              Uch oddiy qadam — va tadbiringiz ishga tushishga tayyor
            </p>
          </div>
        </div>

        <div ref={containerRef} className="relative grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* LEFT — sticky visual */}
          <div className="relative lg:sticky lg:top-24 lg:h-[70vh]">
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              {STEPS.map((s, i) => {
                const Icon = s.Icon
                return (
                  <div
                    key={s.n}
                    ref={(el) => {
                      visualRefs.current[i] = el
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <div
                      className={`mb-8 flex h-40 w-40 items-center justify-center rounded-[2rem] bg-gradient-to-br ${s.color} shadow-[0_30px_80px_-10px_rgba(139,92,246,0.5)]`}
                    >
                      <Icon className="size-16 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-[10px] tracking-[0.4em] uppercase text-white/30">
                      Qadam
                    </div>
                    <div className="mb-4 font-serif text-8xl font-bold leading-none tracking-tight text-aurora">
                      {s.n}
                    </div>
                    <h3 className="max-w-md text-center font-serif text-4xl font-bold tracking-tight text-white">
                      {s.t}
                    </h3>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT — scroll content */}
          <div className="relative pl-10">
            <div className="absolute top-0 bottom-0 left-3 w-px bg-white/10" />
            <div
              ref={progressRef}
              className="absolute top-0 bottom-0 left-3 w-px origin-top bg-gradient-to-b from-aurora-cyan via-aurora-violet to-aurora-pink"
            />

            <div className="flex flex-col gap-32">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => {
                    stepRefs.current[i] = el
                  }}
                  className="relative"
                >
                  <div
                    className={`absolute top-2 -left-[37px] flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${s.color} shadow-[0_0_0_4px_rgba(5,5,17,1),0_0_0_6px_rgba(139,92,246,0.4)]`}
                  />

                  <div className="mb-3 text-xs font-bold tracking-[0.4em] uppercase text-aurora">
                    Qadam {s.n}
                  </div>
                  <h3 className="mb-4 font-serif text-4xl font-bold tracking-tight text-white">
                    {s.t}
                  </h3>
                  <p className="max-w-md text-lg leading-[1.75] text-white/55">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
