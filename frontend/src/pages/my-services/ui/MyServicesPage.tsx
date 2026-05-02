import { useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { MyServiceCard } from '@entities/service'
import { useInfiniteMyServices } from '@entities/service/model/service.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Plus } from 'lucide-react'

export function MyServicesPage() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMyServices()

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const services = data?.pages.flatMap((p) => p.data) ?? []

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Mening xizmatlarim</h1>
        <Link
          to="/my-services/create"
          className="bg-primary text-navy hover:bg-primary-light inline-flex h-9 items-center gap-1.5 rounded-xl border-0 px-4 text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(76,140,167,0.35)]"
        >
          <Plus className="size-3.5" />
          Qo'shish
        </Link>
      </div>

      {services.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">Sizda hozircha xizmatlar yo'q</p>
          <Link to="/my-services/create">
            <Button>Birinchi xizmat qo'shish</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <MyServiceCard key={service.id} service={service} index={index} />
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
