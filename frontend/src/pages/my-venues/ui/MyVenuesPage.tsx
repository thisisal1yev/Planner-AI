import { useRef, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { Funnel, Plus } from 'lucide-react'
import { MyVenueCard } from '@entities/venue'
import { useInfiniteMyVenues } from '@entities/venue/model/venue.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { useQuery } from '@tanstack/react-query'
import { citiesApi } from '@shared/api/citiesApi'
import { cityKeys } from '@shared/api/queryKeys'

export function MyVenuesPage() {
  const [city, setCity] = useState('')
  const [minCapacity, setMinCapacity] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { data: cities = [] } = useQuery({
    queryKey: cityKeys.list(),
    queryFn: citiesApi.listCities,
  })

  const hasAdvancedFilters = !!minCapacity || !!maxPrice
  const hasFilters = !!city || hasAdvancedFilters

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMyVenues({
    city: city || undefined,
    minCapacity: minCapacity ? Number(minCapacity) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const venues = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.meta.total

  function resetFilters() {
    setCity('')
    setMinCapacity('')
    setMaxPrice('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-4">
          <h1 className="text-foreground font-serif text-4xl leading-none font-bold md:text-5xl">
            Mening maydonlarim
          </h1>

          <div className="flex items-center justify-between gap-x-5 text-right">
            <div>
              <p className="text-primary font-serif text-3xl leading-none font-semibold">
                {total ?? '—'}
              </p>

              <p className="text-muted-foreground mt-0.5 text-xs">maydon topildi</p>
            </div>

            <Link
              to="/my-venues/create"
              className="bg-primary text-navy hover:bg-primary-light mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl border-0 px-4 text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(76,140,167,0.35)]"
            >
              <Plus className="size-3.5" />
              Qo'shish
            </Link>
          </div>
        </div>

        <div className="from-primary/50 via-primary/15 mt-4 h-px bg-linear-to-r to-transparent" />
      </div>

      {/* ── City pills + advanced filter toggle ── */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: '', label: 'Barcha shaharlar' },
          ...cities,
        ].map((c) => (
          <button
            key={c.value}
            onClick={() => setCity(c.value)}
            className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${city === c.value ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-transparent'}`}
          >
            {c.label}
          </button>
        ))}

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`ml-auto flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            showAdvanced || hasAdvancedFilters
              ? 'border-primary/50 text-primary bg-primary/5'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          }`}
        >
          <Funnel className="h-3.5 w-3.5" />
          Filtr
          {hasAdvancedFilters && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
        </button>
      </div>

      {/* ── Advanced filters (collapsible) ── */}
      {showAdvanced && (
        <div className="bg-card border-border -mt-4 flex animate-[svc-in_0.45s_ease-out_both] flex-wrap items-end gap-4 rounded-2xl border p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase">
              O'rindan (min)
            </label>

            <input
              type="number"
              placeholder="100"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="bg-background border-input focus:border-ring text-foreground h-9 w-32 rounded-lg border px-3 text-sm transition-colors focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase">
              Narx gacha (UZS/kun)
            </label>

            <input
              type="number"
              placeholder="5 000 000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-background border-input focus:border-ring text-foreground h-9 w-40 rounded-lg border px-3 text-sm transition-colors focus:outline-none"
            />
          </div>

          {hasAdvancedFilters && (
            <button
              onClick={() => {
                setMinCapacity('')
                setMaxPrice('')
              }}
              className="text-muted-foreground hover:text-destructive border-border h-9 rounded-lg border px-3 text-sm transition-colors"
            >
              Tozalash
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <EmptyState
          title="Maydonlar topilmadi"
          description={
            hasFilters ? "Filtrlarni o'zgartirib ko'ring" : "Sizda hozircha maydonlar yo'q"
          }
          action={
            hasFilters
              ? { label: 'Filtrlarni tozalash', onClick: resetFilters }
              : { label: "Birinchi maydon qo'shish", onClick: () => {} }
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue, index) => (
            <MyVenueCard key={venue.id} venue={venue} index={index} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}
