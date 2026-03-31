import { Link } from 'react-router'
import { StarRating } from '@shared/ui/StarRating'
import { formatUZS } from '@shared/lib/dateUtils'
import type { Service } from '../model/types'

interface ServiceCardProps {
  service: Service
  index?: number
}

const CATEGORY_LABEL: Record<string, string> = {
  CATERING:   'Katering',
  DECORATION: 'Bezak',
  SOUND:      'Ovoz',
  PHOTO:      'Foto',
  SECURITY:   'Xavfsizlik',
}

const CATEGORY_ICON: Record<string, string> = {
  CATERING:   '🍽',
  DECORATION: '✦',
  SOUND:      '♪',
  PHOTO:      '◉',
  SECURITY:   '◈',
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const fadeDelay = `svc-d${(index % 12) + 1}`

  return (
    <Link
      to={`/services/${service.id}`}
      className={`svc-card svc-fade ${fadeDelay} group flex flex-col rounded-[14px] overflow-hidden border border-white/7 bg-white/3 no-underline backdrop-blur-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-[5px] hover:border-gold/28 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,150,58,0.12)]`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 shrink-0">
        {service.imageUrls[0] ? (
          <>
            <img
              src={service.imageUrls[0]}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,15,25,0.75)_0%,transparent_55%)] pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full bg-gold/6 flex items-center justify-center">
            <svg className="w-11 h-11 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-2.5 left-3 text-[11px] text-cream/75 bg-[rgba(8,15,25,0.65)] backdrop-blur-sm px-[9px] py-[3px] rounded-full border border-cream/12 flex items-center gap-1">
          <span>{CATEGORY_ICON[service.category]}</span>
          {CATEGORY_LABEL[service.category]}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 flex flex-col gap-2.5 flex-1">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-cream/92 leading-[1.35] line-clamp-2 transition-colors duration-200 group-hover:text-gold-light">
            {service.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <StarRating rating={service.rating} />
            <span className="text-[11px] text-cream/45">{service.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[13px] text-cream/38">
          <svg className="w-[13px] h-[13px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {service.city}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-t-white/5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-cream/30 mb-0.5">Narxdan boshlab</p>
            <span className="text-[13px] text-gold font-semibold leading-none">{formatUZS(service.priceFrom)}</span>
          </div>
          <span className="text-[11px] text-gold flex items-center gap-1 font-medium">
            Batafsil
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
