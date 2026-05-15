import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import {
  useMagnetic,
  LineReveal,
  AuroraBackground,
  FloatingOrbs,
  ScrollChars,
} from '@shared/lib/animation'

export function FinalCTA() {
  const primaryRef = useMagnetic<HTMLAnchorElement>(0.35)
  const outlineRef = useMagnetic<HTMLAnchorElement>(0.35)

  return (
    <section className="relative overflow-hidden bg-navy px-[clamp(24px,5vw,80px)] py-24">
      <div className="mx-auto max-w-[1800px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-navy-2 px-[clamp(28px,6vw,96px)] py-[clamp(60px,10vw,140px)] text-center">
          <AuroraBackground intensity="high" />
          <FloatingOrbs count={4} />
          <div className="grain absolute inset-0" />

          <div className="relative z-10">
            <div className="chip mx-auto mb-6">Hoziroq boshlang</div>

            <ScrollChars
              as="h2"
              className="mx-auto max-w-6xl font-serif text-[clamp(48px,9vw,160px)] font-bold leading-[0.9] tracking-[-0.035em]"
            >
              Tadbir boshlashga tayyormisiz?
            </ScrollChars>

            <LineReveal delay={0.2}>
              <p className="mx-auto mt-7 mb-12 max-w-xl text-lg leading-[1.7] text-white/65">
                Planner AI orqali muvaffaqiyatli tadbirlarni allaqachon o'tkazayotgan yuzlab
                tashkilotchilarga qo'shiling
              </p>
            </LineReveal>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                ref={primaryRef}
                to="/register"
                data-cursor-hover
                className="group btn-primary"
              >
                <span className="relative z-10">Bepul boshlash</span>
                <ArrowRight className="relative z-10 ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                ref={outlineRef}
                to="/events"
                data-cursor-hover
                className="btn-outline"
              >
                Tadbirlarni ko'rish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
