import { useRef, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarRange, X } from 'lucide-react'
import { EventCard } from '@entities/event'
import { useInfiniteEvents } from '@entities/event/model/event.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { categoriesApi } from '@shared/api/categoriesApi'
import { categoryKeys } from '@shared/api/queryKeys'

export function EventsListPage() {
  const [categoryId, setCategoryId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showDates, setShowDates] = useState(false)

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: categoryKeys.eventCategories(),
    queryFn: categoriesApi.listEventCategories,
    staleTime: Infinity,
  })

  const hasFilters = !!categoryId || !!dateFrom || !!dateTo

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteEvents({
    status: 'PUBLISHED',
    categoryId: categoryId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const events = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.meta.total

  function resetFilters() {
    setCategoryId('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-foreground font-serif text-4xl leading-none font-bold md:text-5xl">
            Tadbirlar
          </h1>

          <div className="shrink-0 text-right">
            <p className="text-primary font-serif text-3xl leading-none font-semibold">
              {total ?? '—'}
            </p>

            <p className="text-muted-foreground mt-0.5 text-xs">tadbir topildi</p>
          </div>
        </div>
        <div className="from-primary/50 via-primary/15 mt-4 h-px bg-linear-to-r to-transparent" />
      </div>

      {/* ── Category pills + date toggle ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* "Barchasi" chip */}
        <button
          onClick={() => setCategoryId('')}
          className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${categoryId === '' ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-transparent'}`}
        >
          Barchasi
        </button>

        {/* Category chips — skeleton while loading */}
        {categoriesLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-muted/30 h-9 w-24 animate-pulse rounded-full" />
            ))
          : categories?.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${categoryId === c.id ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-transparent'}`}
              >
                {c.name}
              </button>
            ))}

        <button
          onClick={() => setShowDates((v) => !v)}
          className={`ml-auto flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            showDates || !!dateFrom || !!dateTo
              ? 'border-primary/50 text-primary bg-primary/5'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          }`}
        >
          <CalendarRange className="h-3.5 w-3.5" />
          Sana
          {(dateFrom || dateTo) && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
        </button>
      </div>

      {/* ── Date filters (collapsible) ── */}
      {showDates && (
        <div className="bg-card border-border -mt-4 flex animate-[svc-in_0.45s_ease-out_both] flex-wrap items-end gap-4 rounded-2xl border p-5">
          <div className="flex min-w-40 flex-col gap-1.5">
            <label className="text-muted-foreground/60 text-[11px] font-medium tracking-[0.08em] uppercase">
              Boshlanish (dan)
            </label>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-background border-border focus:border-primary/40 text-foreground h-8 rounded-lg border px-3 text-[13px] transition-colors focus:outline-none"
            />
          </div>

          <div className="flex min-w-40 flex-col gap-1.5">
            <label className="text-muted-foreground/60 text-[11px] font-medium tracking-[0.08em] uppercase">
              Tugash (gacha)
            </label>

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-background border-border focus:border-primary/40 text-foreground h-8 rounded-lg border px-3 text-[13px] transition-colors focus:outline-none"
            />
          </div>

          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom('')
                setDateTo('')
              }}
              className="text-muted-foreground hover:text-foreground border-border flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition-colors"
            >
              <X className="size-3" />
              Tozalash
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="Tadbirlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={hasFilters ? { label: 'Filtrlarni tozalash', onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      )}

      {/* ── Infinite scroll sentinel ── */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}
