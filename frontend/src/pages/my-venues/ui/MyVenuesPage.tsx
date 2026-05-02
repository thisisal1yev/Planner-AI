import { useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { MyVenueCard } from '@entities/venue'
import { useInfiniteMyVenues } from '@entities/venue/model/venue.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Plus } from 'lucide-react'

export function MyVenuesPage() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMyVenues()

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const venues = data?.pages.flatMap((p) => p.data) ?? []

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Mening maydonlarim</h1>
        <Link
          to="/my-venues/create"
          className="bg-primary text-navy hover:bg-primary-light inline-flex h-9 items-center gap-1.5 rounded-xl border-0 px-4 text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(76,140,167,0.35)]"
        >
          <Plus className="size-3.5" />
          Qo'shish
        </Link>
      </div>

      {venues.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">Sizda hozircha maydonlar yo'q</p>
          <Link to="/my-venues/create">
            <Button>Birinchi maydon qo'shish</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue, index) => (
          <MyVenueCard key={venue.id} venue={venue} index={index} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}
