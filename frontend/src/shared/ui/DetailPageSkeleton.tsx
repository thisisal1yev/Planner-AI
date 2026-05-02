import { Skeleton } from '@/shared/ui/primitives/skeleton'

export function DetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton
        className="h-120 w-full"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
      />
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <div className="flex flex-col gap-3 pl-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-px">
            <Skeleton className="h-24 rounded-none" />
            <Skeleton className="h-24 rounded-none" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
