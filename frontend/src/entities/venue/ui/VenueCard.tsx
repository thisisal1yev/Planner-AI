import { Link } from 'react-router'
import { formatUZS } from '@shared/lib/dateUtils'
import type { Venue } from '../model/types'

interface VenueCardProps {
  venue: Venue
}

const AMENITY_ICON: Record<string, string> = {
  wifi:    '⌘',
  parking: '⊕',
  sound:   '♪',
  stage:   '◈',
  indoor:  '⬡',
}

export function VenueCard({ venue }: VenueCardProps) {
  const amenities = [
    venue.hasWifi    && { key: 'wifi',    label: 'WiFi' },
    venue.hasParking && { key: 'parking', label: 'Parkovka' },
    venue.hasSound   && { key: 'sound',   label: 'Ovoz' },
    venue.hasStage   && { key: 'stage',   label: 'Sahna' },
    venue.isIndoor   && { key: 'indoor',  label: 'Yopiq' },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-[#0f1925] no-underline
        transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]
        hover:-translate-y-[6px] hover:border-gold/30
        hover:shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,150,58,0.14)]"
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
        {venue.imageUrls[0] ? (
          <img
            src={venue.imageUrls[0]}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#101b28] to-[#080f19] flex items-center justify-center">
            <svg className="w-16 h-16 text-gold/8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.4) 45%, transparent 75%)' }}
        />

        {/* Capacity — top left stat */}
        <div className="absolute top-3 left-3 flex items-baseline gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2.5 py-1.5">
          <span className="text-[18px] font-bold text-cream/90 leading-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}>
            {venue.capacity.toLocaleString()}
          </span>
          <span className="text-[10px] text-cream/45">o'rin</span>
        </div>

        {/* Rating — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2 py-1.5">
          <svg className="w-3 h-3 text-gold" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[12px] font-medium text-cream/80">{venue.rating.toFixed(1)}</span>
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5">
          <h3
            className="lp-serif text-[20px] font-bold leading-[1.22] line-clamp-1 text-cream/95
              transition-colors duration-200 group-hover:text-gold-light"
          >
            {venue.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-cream/40">
          <svg className="w-3 h-3 shrink-0 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate">{venue.city}, {venue.address}</span>
        </div>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {amenities.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 text-[10px] py-[3px] px-2 rounded-full
                  bg-white/4 border border-white/8 text-cream/45 tracking-wide"
              >
                <span className="text-gold/50 text-[9px]">{AMENITY_ICON[key]}</span>
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.1em] text-cream/25 mb-0.5">Kunlik narx</p>
            <span className="text-[14px] text-gold font-semibold leading-none">
              {formatUZS(venue.pricePerDay)}
              <span className="text-[11px] font-normal text-gold/55">/kun</span>
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
