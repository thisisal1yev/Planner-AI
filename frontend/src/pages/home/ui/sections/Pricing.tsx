import { useState } from 'react'
import { Link } from 'react-router'
import { Check, Zap } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useReveal, AuroraBackground, ScrollChars } from '@shared/lib/animation'

const PLANS = [
  {
    n: 'Bepul',
    p: { m: 0, y: 0 },
    desc: "Boshlang'ichlar uchun",
    fs: ["Tadbirlarni ko'rish", 'Chipta sotib olish', 'Shaxsiy kabinet', 'Sharhlar yozish'],
    cta: 'Bepul boshlash',
    hot: false,
  },
  {
    n: 'Pro',
    p: { m: 99000, y: 79000 },
    desc: 'Tashkilotchilar uchun',
    fs: [
      'Oyiga 10 tadbir',
      'Chipta sotish + komissiya',
      "To'liq analitika",
      'Volontyorlar boshqaruvi',
      'Ustuvor yordam',
      'Boost — 50% chegirma',
    ],
    cta: "14 kun sinab ko'ring",
    hot: true,
  },
  {
    n: 'Biznes',
    p: { m: 299000, y: 249000 },
    desc: 'Kompaniyalar uchun',
    fs: [
      'Cheksiz tadbirlar',
      'Multi-akkaunt',
      'API kirish',
      'Custom brending',
      'Shaxsiy menejer',
      'SLA 99.9%',
    ],
    cta: "Biz bilan bog'laning",
    hot: false,
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  const ref = useReveal<HTMLDivElement>({
    selector: '.plan-anim',
    y: 80,
    stagger: 0.15,
    duration: 1.1,
  })

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-navy-2 px-[clamp(24px,5vw,80px)] py-32"
    >
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <div className="chip mx-auto mb-5">Narxlar</div>
          <ScrollChars
            as="h2"
            className="mx-auto max-w-5xl font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
          >
            Sizga mos tarif
          </ScrollChars>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/55">
            Bepul boshlang va o'sishingiz bilan kengaytiring
          </p>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setAnnual(false)}
              data-cursor-hover
              className={cn(
                'rounded-full px-6 py-2.5 text-sm font-medium transition-all',
                !annual
                  ? 'bg-gradient-to-r from-aurora-violet to-aurora-pink text-white shadow-lg'
                  : 'text-white/55 hover:text-white'
              )}
            >
              Oylik
            </button>
            <button
              onClick={() => setAnnual(true)}
              data-cursor-hover
              className={cn(
                'flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all',
                annual
                  ? 'bg-gradient-to-r from-aurora-violet to-aurora-pink text-white shadow-lg'
                  : 'text-white/55 hover:text-white'
              )}
            >
              Yillik
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  annual ? 'bg-white text-aurora-violet' : 'bg-aurora-violet/20 text-aurora-violet'
                )}
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = annual ? p.p.y : p.p.m
            return (
              <div
                key={p.n}
                className={cn(
                  'plan-anim group relative flex flex-col rounded-3xl p-8 backdrop-blur-md transition-all duration-500',
                  p.hot
                    ? 'border-2 border-aurora-violet/60 bg-gradient-to-br from-aurora-violet/15 via-aurora-pink/10 to-aurora-orange/5 shadow-[0_40px_120px_-20px_rgba(139,92,246,0.6)]'
                    : 'border border-white/10 bg-white/[0.03] hover:border-white/25'
                )}
              >
                <div className="grain pointer-events-none absolute inset-0 rounded-3xl" />

                {p.hot && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-violet to-aurora-pink px-4 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-white shadow-xl">
                      <Zap className="size-3 fill-current" />
                      Eng mashhur
                    </div>
                  </div>
                )}

                <div className="relative">
                  <p className="mb-3 text-[10px] tracking-[0.3em] uppercase text-white/45">{p.n}</p>
                  <div className="mb-1 flex items-baseline gap-1.5">
                    <span className="font-serif text-6xl font-bold leading-none tracking-tight text-aurora">
                      {price === 0 ? '0' : (price / 1000).toFixed(0)}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-white/45">
                        ming so'm/oy
                      </span>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <p className="mb-1 text-xs font-medium text-aurora-cyan">
                      Yiliga to'lov · 20% chegirma
                    </p>
                  )}

                  <p className="mb-7 text-sm text-white/55">{p.desc}</p>

                  <ul className="m-0 mb-8 flex flex-col gap-3.5 p-0 list-none">
                    {p.fs.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                        <span
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                            p.hot
                              ? 'bg-gradient-to-br from-aurora-violet to-aurora-pink'
                              : 'bg-white/10'
                          )}
                        >
                          <Check className="size-3 text-white" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    data-cursor-hover
                    className={cn(
                      'block rounded-full p-4 text-center text-sm font-semibold tracking-wide no-underline transition-all',
                      p.hot
                        ? 'bg-gradient-to-r from-aurora-violet via-aurora-pink to-aurora-orange text-white shadow-[0_12px_40px_-8px_rgba(236,72,153,0.6)] hover:shadow-[0_18px_50px_-8px_rgba(236,72,153,0.8)]'
                        : 'border border-white/20 text-white hover:border-white/45 hover:bg-white/5'
                    )}
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
