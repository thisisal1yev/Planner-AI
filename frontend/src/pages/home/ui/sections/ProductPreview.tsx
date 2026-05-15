import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, MapPin, Users, TrendingUp, CheckCircle2, QrCode } from 'lucide-react'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

export function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mockupRef.current || !containerRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mockupRef.current,
        { y: 120, opacity: 0, rotateX: 28, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          rotateX: 8,
          scale: 1,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.to(mockupRef.current, {
        yPercent: -12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-navy-2 px-[clamp(24px,5vw,80px)] py-32"
    >
      <AuroraBackground intensity="medium" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1800px] text-center">
        <div className="chip mx-auto mb-5">Mahsulot</div>
        <ScrollChars
          as="h2"
          className="mx-auto max-w-6xl font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
        >
          Bir dashboard'da barcha nazorat
        </ScrollChars>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
          Tadbir, chipta, daromad va ishtirokchi statistikasi — har soniya yangilanadi
        </p>

        <div className="mt-20 [perspective:1500px]">
          <div
            ref={mockupRef}
            className="relative mx-auto max-w-7xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute -inset-x-12 -bottom-16 h-48 bg-gradient-to-r from-aurora-violet/40 via-aurora-pink/40 to-aurora-orange/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-navy-3 shadow-[0_80px_200px_-30px_rgba(139,92,246,0.6)]">
              <div className="flex items-center gap-2 border-b border-white/10 bg-navy px-5 py-3">
                <div className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-red-400/70" />
                  <span className="size-3 rounded-full bg-yellow-400/70" />
                  <span className="size-3 rounded-full bg-green-400/70" />
                </div>
                <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg bg-white/5 px-3 py-1 text-xs text-white/60 ring-1 ring-white/8">
                  <span className="text-aurora-violet">●</span>
                  planner-ai.uz/dashboard
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 p-7">
                <div className="col-span-3 flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2 rounded-xl bg-aurora-violet/15 px-3 py-2.5 text-xs font-semibold text-aurora-violet">
                    <Calendar className="size-3.5" /> Tadbirlar
                  </div>
                  {['Maydonlar', 'Chiptalar', 'Vendorlar', 'Analitika', 'Sozlamalar'].map((x) => (
                    <div key={x} className="rounded-xl px-3 py-2.5 text-xs text-white/40">
                      {x}
                    </div>
                  ))}
                </div>

                <div className="col-span-9 flex flex-col gap-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { l: 'Tadbirlar', v: '24', Icon: Calendar, c: 'text-aurora-cyan' },
                      { l: 'Sotuvlar', v: '1,432', Icon: TrendingUp, c: 'text-aurora-pink' },
                      { l: 'Maydon', v: '12', Icon: MapPin, c: 'text-aurora-orange' },
                      { l: 'Ishtirok.', v: '8,540', Icon: Users, c: 'text-aurora-violet' },
                    ].map((s) => {
                      const Icon = s.Icon
                      return (
                        <div
                          key={s.l}
                          className="rounded-xl border border-white/8 bg-white/[0.03] p-3.5 text-left"
                        >
                          <Icon className={`size-4 ${s.c} mb-2`} />
                          <div className="text-lg font-bold text-white">{s.v}</div>
                          <div className="text-[10px] text-white/40">{s.l}</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex h-48 items-end gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-4">
                    {[40, 65, 35, 80, 55, 90, 70, 95, 60, 75, 85, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-aurora-violet via-aurora-pink to-aurora-orange"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                      <QrCode className="size-9 text-aurora-cyan" />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">QR validatsiya</div>
                        <div className="text-[10px] text-aurora-cyan">● Live</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                      <CheckCircle2 className="size-9 text-emerald-400" />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">
                          To'lov muvaffaqiyatli
                        </div>
                        <div className="text-[10px] text-white/40">Payme · 5 min oldin</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
