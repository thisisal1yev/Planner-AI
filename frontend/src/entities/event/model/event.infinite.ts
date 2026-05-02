import { useInfiniteQuery } from '@tanstack/react-query'
import { eventsApi, type QueryEventsDto } from '../api/eventsApi'
import { eventKeys } from '@shared/api/queryKeys'
import { useAuthStore } from '@shared/model/auth.store'

export function useInfiniteEvents(filters: Omit<QueryEventsDto, 'page' | 'limit'> = {}) {
  return useInfiniteQuery({
    queryKey: eventKeys.list(filters),
    queryFn: ({ pageParam }) =>
      eventsApi.list({ ...filters, page: pageParam as number, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  })
}

export function useInfiniteMyEvents() {
  const userId = useAuthStore((s) => s.user?.id)
  return useInfiniteQuery({
    queryKey: [...eventKeys.myList(), userId],
    queryFn: ({ pageParam }) =>
      eventsApi.myList({ page: pageParam as number, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    enabled: !!userId,
  })
}
