import { useInfiniteQuery } from '@tanstack/react-query'
import { venuesApi, type QueryVenuesDto } from '../api/venuesApi'
import { venueKeys } from '@shared/api/queryKeys'
import { useAuthStore } from '@shared/model/auth.store'

export function useInfiniteVenues(filters: Omit<QueryVenuesDto, 'page' | 'limit'> = {}) {
  return useInfiniteQuery({
    queryKey: venueKeys.list(filters),
    queryFn: ({ pageParam }) =>
      venuesApi.list({ ...filters, page: pageParam as number, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  })
}

export function useInfiniteMyVenues() {
  const userId = useAuthStore((s) => s.user?.id)
  return useInfiniteQuery({
    queryKey: [...venueKeys.myList(), userId],
    queryFn: ({ pageParam }) =>
      venuesApi.myList({ page: pageParam as number, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    enabled: !!userId,
  })
}
