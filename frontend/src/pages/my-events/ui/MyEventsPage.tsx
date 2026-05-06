import { useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { MyEventCard } from '@entities/event'
import { useInfiniteMyEvents } from '@entities/event/model/event.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { CalendarX2, Plus } from 'lucide-react'

export function MyEventsPage() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMyEvents()

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const events = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Mening tadbirlarim</h1>

        <Link
          to="/my-events/create"
          className="bg-primary text-navy hover:bg-primary-light inline-flex h-9 items-center gap-1.5 rounded-xl border-0 px-4 text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(76,140,167,0.35)]"
        >
          <Plus className="size-3.5" />
          Yaratish
        </Link>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="Tadbirlar yo'q"
          description="Hali birorta tadbir yaratmagansiz"
          action={{ label: 'Birinchi tadbir yaratish', href: '/my-events/create' }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <MyEventCard key={event.id} event={event} index={index} />
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
