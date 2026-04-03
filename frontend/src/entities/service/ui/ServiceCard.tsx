import { Link } from 'react-router'
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

const CATEGORY_GLYPH: Record<string, string> = {
  CATERING:   '🍽',
  DECORATION: '✦',
  SOUND:      '♪',
  PHOTO:      '◉',
  SECURITY:   '◈',
}

// Subtle per-category accent hue for the image placeholder bg
const CATEGORY_BG: Record<string, string> = {
  CATERING:   'from-[#1a1208] to-[#080f19]',
  DECORATION: 'from-[#0e1520] to-[#080f19]',
  SOUND:      'from-[#0a1418] to-[#080f19]',
  PHOTO:      'from-[#12120a] to-[#080f19]',
  SECURITY:   'from-[#0f1010] to-[#080f19]',
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const fadeDelay = `svc-d${(index % 12) + 1}`
  const glyph  = CATEGORY_GLYPH[service.category] ?? '✦'
  const catBg  = CATEGORY_BG[service.category]    ?? 'from-[#0f1925] to-[#080f19]'
  const label  = CATEGORY_LABEL[service.category] ?? service.category

  return (
    <Link
      to={`/services/${service.id}`}
      className={`svc-card svc-fade ${fadeDelay} group relative flex flex-col rounded-2xl overflow-hidden
        border border-white/8 bg-navy-3 no-underline`}
    >
      {/* Animated gold shimmer rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-10 pointer-events-none
          origin-center scale-x-0 group-hover:scale-x-100
          transition-transform duration-500 ease-out"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #c9963a 40%, #e8c06a 60%, transparent 100%)' }}
      />

      {/* ── Image ── */}
      <div className="relative overflow-hidden h-52 shrink-0">
        {service.imageUrls[0] ? (
          <img
            src={service.imageUrls[0]}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${catBg} flex items-center justify-center`}>
            {/* Large watermark glyph in empty state */}
            <span className="text-[80px] leading-none select-none opacity-[0.07]">{glyph}</span>
          </div>
        )}

        {/* Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.4) 45%, transparent 75%)' }}
        />

        {/* Category pill — top left */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-medium
          py-[4px] px-[10px] rounded-full backdrop-blur-sm
          bg-[rgba(8,15,25,0.6)] border border-gold/20 text-gold/80">
          <span className="text-[12px] leading-none">{glyph}</span>
          {label}
        </div>

        {/* Rating — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2 py-1.5">
          <svg className="w-3 h-3 text-gold" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[12px] font-medium text-cream/80">{service.rating.toFixed(1)}</span>
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5">
          <h3
            className="lp-serif text-[20px] font-bold leading-[1.22] line-clamp-2 text-cream/95
              transition-colors duration-200 group-hover:text-gold-light"
          >
            {service.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-cream/40">
          <svg className="w-3 h-3 shrink-0 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {service.city}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-cream/25 mb-0.5">Narxdan boshlab</p>
            <span className="text-[14px] text-gold font-semibold leading-none">
              {formatUZS(service.priceFrom)}
            </span>
          </div>
          <span className="text-[12px] text-gold/70 font-medium flex items-center gap-1 group-hover:text-gold transition-colors duration-200">
            Batafsil
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
