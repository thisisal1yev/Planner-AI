import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { venuesApi, VenueCard } from '@entities/venue'
import { venueKeys } from '@shared/api/queryKeys'
import { Spinner } from '@shared/ui/Spinner'
import { useReveal, AuroraBackground, ScrollChars } from '@shared/lib/animation'

export function VenuesSection() {
  const { data, isLoading } = useQuery({
    queryKey: venueKeys.list({ limit: 3 }),
    queryFn: () => venuesApi.list({ limit: 3 }),
  })

  const cardsRef = useReveal<HTMLDivElement>({
    selector: '.venue-card-wrap',
    y: 80,
    stagger: 0.12,
    duration: 1.1,
  })

  return (
    <section className="relative overflow-hidden bg-navy-2 px-[clamp(24px,5vw,80px)] py-32">
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-16 grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 md:col-span-8">
            <div className="chip mb-5">Maydonlar</div>
            <ScrollChars
              as="h2"
              className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
            >
              Mashhur maydonlar
            </ScrollChars>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <div className="flex items-baseline gap-3 md:justify-end">
              <span className="font-serif text-7xl font-bold leading-none tracking-tight text-aurora">
                120+
              </span>
              <span className="text-sm text-white/45">maydon</span>
            </div>
            <p className="mt-4 max-w-sm text-base text-white/55 md:ml-auto">
              Tadbirlaringiz uchun eng yaxshi joylar — tekshirilgan, narxlar shaffof
            </p>
            <Link
              to="/venues"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm no-underline text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/5"
            >
              Barcha maydonlar →
            </Link>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <div ref={cardsRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((v, i) => (
              <div key={v.id} className="venue-card-wrap">
                <VenueCard venue={v} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
