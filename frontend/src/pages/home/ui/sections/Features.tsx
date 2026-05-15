import { useEffect, useRef } from 'react'
import {
  CalendarRange,
  Building2,
  Ticket,
  Star,
  QrCode,
  BarChart3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'

gsap.registerPlugin(ScrollTrigger)

const FEATS = [
  { Icon: CalendarRange, t: 'Tadbirlarni boshqarish', d: 'Bir necha bosish bilan tadbirlarni yarating, tahrirlang va nashr eting.' },
  { Icon: Building2, t: '120+ tekshirilgan maydon', d: "O'zbekiston bo'ylab kategoriya, narx va sharhlar bilan." },
  { Icon: Ticket, t: 'Click + Payme integratsiya', d: "O'rnatilgan to'lov, 2.5% eng past komissiya." },
  { Icon: BarChart3, t: 'Real vaqt analitika', d: "Sotuvlar, daromad, ishtirokchilar — bir dashboard'da. Excel eksport." },
  { Icon: QrCode, t: 'QR chiptalar', d: 'Avto-generatsiya, mobil validatsiya, internet kerak emas.' },
  { Icon: Star, t: 'Tasdiqlangan sharhlar', d: 'Faqat ishtirok etgan foydalanuvchilar yoza oladi.' },
  { Icon: ShieldCheck, t: 'JWT + Google OAuth', d: 'SSL/TLS shifrlash, kunlik backup, parol hash.' },
  { Icon: Sparkles, t: 'Boost & Badges', d: 'Vendor va maydonlar uchun premium nishonlar va promotion.' },
]

function FeatureRow({ feat, index }: { feat: (typeof FEATS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { Icon } = feat

  useEffect(() => {
    if (!ref.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="group relative border-b border-white/10 py-10">
      <div className="grid grid-cols-12 items-center gap-6">
        <div className="col-span-1 font-mono text-xs tracking-[0.3em] text-white/30">
          0{index + 1}
        </div>
        <div className="col-span-1 flex justify-start">
          <Icon
            className="size-7 text-aurora-violet transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-aurora-pink"
            strokeWidth={1.5}
          />
        </div>
        <div className="col-span-10 md:col-span-5">
          <h3 className="font-serif text-3xl font-bold leading-tight tracking-tight text-white transition-all duration-500 group-hover:translate-x-2 group-hover:text-aurora md:text-5xl">
            {feat.t}
          </h3>
        </div>
        <div className="col-span-10 col-start-2 md:col-span-5 md:col-start-auto">
          <p className="max-w-md text-base leading-[1.7] text-white/55 md:text-lg">{feat.d}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-aurora-violet via-aurora-pink to-aurora-orange transition-transform duration-700 group-hover:scale-x-100" />
    </div>
  )
}

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-navy px-[clamp(24px,5vw,80px)] py-32"
    >
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-24 grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 md:col-span-8">
            <div className="chip mb-5">Imkoniyatlar</div>
            <ScrollChars
              as="h2"
              className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
            >
              Tashkilotchi uchun hamma narsa
            </ScrollChars>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-7xl font-bold leading-none tracking-tight text-aurora">
                08
              </span>
              <span className="text-sm text-white/45">imkoniyat</span>
            </div>
            <p className="mt-4 max-w-sm text-base text-white/55">
              Professional tadbirlarni tashkil etish uchun to'liq vositalar to'plami — bir oilada
              integratsiyalashgan.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          {FEATS.map((f, i) => (
            <FeatureRow key={f.t} feat={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
