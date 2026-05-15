import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote } from 'lucide-react'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

const REVIEWS = [
  {
    n: 'Sevara Nazarova',
    r: 'Event tashkilotchisi',
    t: "Yarim soatda 500 chipta sotildi. QR validatsiya ish vaqtimizning 80% ini tejadi. Endi har bir tadbirimni shu yerda o'tkazaman.",
    avatar: 'SN',
    color: 'from-aurora-violet to-aurora-pink',
  },
  {
    n: 'Bekhzod Rashidov',
    r: "To'yxona egasi",
    t: "Maydonimni qo'shganimga 2 oy bo'ldi — 40 ta band qilish keldi. Boost qildim, daromad 3 barobar oshdi.",
    avatar: 'BR',
    color: 'from-aurora-cyan to-aurora-blue',
  },
  {
    n: 'Aziza Karimova',
    r: 'Marketing menejer',
    t: "Analytics dashboard'i Excel'dan ham tezroq ko'rsatadi. Click integratsiyasi to'g'ridan-to'g'ri ishladi.",
    avatar: 'AK',
    color: 'from-aurora-pink to-aurora-orange',
  },
  {
    n: 'Jamshid Tursunov',
    r: 'Foto-studiya',
    t: "Vendor sifatida ro'yxatdan o'tdim. Birinchi haftada 8 ta buyurtma. Reyting tizimi mijozlarni o'ziga jalb qiladi.",
    avatar: 'JT',
    color: 'from-aurora-orange to-aurora-pink',
  },
  {
    n: 'Madina Yusupova',
    r: 'Konferensiya promo',
    t: "Avval 5 ta turli xizmatdan foydalanardim. Endi hammasi Planner AI'da. Vaqt va asabni tejaydi.",
    avatar: 'MY',
    color: 'from-aurora-blue to-aurora-violet',
  },
  {
    n: 'Sherzod Aliyev',
    r: 'Festival prodyuseri',
    t: "Volontyorlarni boshqarish ajoyib ishlangan. Apply qilgan har bir kishi profilida ko'rinadi.",
    avatar: 'SA',
    color: 'from-aurora-violet to-aurora-cyan',
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !pinRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - window.innerWidth + 200
      gsap.to(trackRef.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${distance + 300}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-navy">
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      {/* Header — separate scrollable block above pin */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-[clamp(24px,5vw,80px)] pt-32 pb-20">
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 md:col-span-8">
            <div className="chip mb-5">Sharhlar</div>
            <ScrollChars
              as="h2"
              className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
            >
              Foydalanuvchilar nima deydi
            </ScrollChars>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="flex items-baseline gap-3 md:justify-end">
              <span className="font-serif text-7xl font-bold leading-none tracking-tight text-aurora">
                4.9
              </span>
              <span className="text-sm text-white/45">/ 5.0</span>
            </div>
            <p className="mt-4 max-w-sm text-base text-white/55 md:ml-auto">
              500+ haqiqiy sharh — tashkilotchilar, vendorlar va ishtirokchilardan
            </p>
          </div>
        </div>
      </div>

      {/* Pinned horizontal scroll */}
      <div ref={pinRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div ref={trackRef} className="flex h-[70%] gap-8 pl-[clamp(24px,5vw,80px)]">
            {REVIEWS.map((r, i) => (
              <div
                key={r.n}
                className="relative flex w-[480px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-9 backdrop-blur-md"
              >
                <div className="grain pointer-events-none absolute inset-0" />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${r.color} opacity-10`}
                />

                <Quote className="absolute top-7 right-7 size-16 text-white/5" />

                <div className="relative">
                  <div className="mb-5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="size-4 fill-aurora-orange text-aurora-orange" />
                    ))}
                  </div>

                  <p className="font-serif text-2xl leading-[1.45] text-white/90">"{r.t}"</p>
                </div>

                <div className="relative mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${r.color} text-sm font-bold text-white shadow-lg`}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{r.n}</p>
                    <p className="text-xs text-white/50">{r.r}</p>
                  </div>
                  <div className="ml-auto font-mono text-xs tracking-[0.3em] text-white/30">
                    0{i + 1}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex w-[440px] shrink-0 flex-col justify-center pr-20">
              <h3 className="font-serif text-6xl font-bold leading-[0.9] tracking-tight text-aurora">
                500+
                <br />
                sharh
              </h3>
              <p className="mt-4 text-base text-white/55">Reyting: 4.9 / 5</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-white/30">
          ← Scroll →
        </div>
      </div>
    </section>
  )
}
