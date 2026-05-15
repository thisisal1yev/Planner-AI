import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

const CATS = [
  { l: 'Konsertlar', to: '/events?type=Konsert', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80', n: '01' },
  { l: 'Konferensiyalar', to: '/events?type=Konferensiya', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&q=80', n: '02' },
  { l: "Ko'rgazmalar", to: "/events?type=Ko'rgazma", img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=80', n: '03' },
  { l: 'Treninglar', to: '/events?type=Trening', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80', n: '04' },
  { l: 'Festivallar', to: '/events?type=Festival', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80', n: '05' },
  { l: 'Ziyofatlar', to: '/events?type=Ziyofat', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80', n: '06' },
  { l: "To'ylar", to: "/events?type=To'y", img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80', n: '07' },
  { l: 'Sport', to: '/events?type=Sport', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80', n: '08' },
]

export function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((item) => {
        if (!item) return
        gsap.fromTo(
          item,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    imgRefs.current.forEach((img, i) => {
      if (!img) return
      gsap.to(img, {
        opacity: active === i ? 1 : 0,
        scale: active === i ? 1 : 1.08,
        duration: 0.6,
        ease: 'power3.out',
      })
    })
  }, [active])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy px-[clamp(24px,5vw,80px)] py-32"
    >
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-16 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="chip mb-5">Kategoriyalar</div>
            <ScrollChars
              as="h2"
              className="font-serif text-[clamp(48px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.03em]"
            >
              Tadbir turini tanlang
            </ScrollChars>
          </div>
          <div className="col-span-12 flex flex-col items-start gap-4 md:col-span-4 md:items-end">
            <p className="max-w-sm text-base text-white/55 md:text-right">
              8 ta asosiy kategoriya. Har biri uchun tekshirilgan vendorlar va maydonlar.
            </p>
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm text-white no-underline backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/5"
            >
              Barcha tadbirlar
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative grid grid-cols-12 gap-8">
          {/* List */}
          <div className="col-span-12 lg:col-span-7">
            <div className="border-t border-white/10">
              {CATS.map((c, i) => (
                <div
                  key={c.l}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  <Link
                    to={c.to}
                    className="group relative flex items-center justify-between border-b border-white/10 py-7 no-underline transition-all"
                  >
                    {/* gradient wash on hover */}
                    <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-aurora-violet/0 via-aurora-violet/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-6">
                      <span className="font-mono text-xs tracking-[0.3em] text-white/30">{c.n}</span>
                      <h3 className="font-serif text-4xl font-bold leading-none tracking-tight text-white/80 transition-all duration-500 group-hover:translate-x-3 group-hover:text-aurora md:text-6xl">
                        {c.l}
                      </h3>
                    </div>

                    <ArrowUpRight className="relative size-7 text-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-aurora-pink" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky image preview */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32 aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-navy-2">
              {CATS.map((c, i) => (
                <div
                  key={c.l}
                  ref={(el) => {
                    imgRefs.current[i] = el
                  }}
                  className="absolute inset-0 opacity-0"
                  style={{ opacity: 0 }}
                >
                  <img src={c.img} alt={c.l} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="mb-2 font-mono text-xs tracking-[0.3em] text-white/60">
                      {c.n}
                    </div>
                    <div className="font-serif text-3xl font-bold text-white">{c.l}</div>
                  </div>
                </div>
              ))}
              {active === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-serif text-xl text-white/30">Hover qiling →</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
