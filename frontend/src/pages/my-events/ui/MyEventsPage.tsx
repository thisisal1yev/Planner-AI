import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi } from '@entities/event'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { PublishEventButton } from '@features/event-publish'

const statusColor: Record<string, 'green' | 'gray' | 'red' | 'indigo'> = {
  PUBLISHED: 'green', DRAFT: 'gray', CANCELLED: 'red', COMPLETED: 'indigo',
}

export function MyEventsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => eventsApi.list({ limit: 50 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-events'] }),
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Мои события</h1>
        <Link to="/my-events/create">
          <Button>+ Создать</Button>
        </Link>
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">У вас пока нет событий</p>
          <Link to="/my-events/create"><Button>Создать первое событие</Button></Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {data?.data.map((event) => (
          <div key={event.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                <Badge color={statusColor[event.status]}>{event.status}</Badge>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(event.startDate).toLocaleDateString('ru-RU')} · {event.capacity} мест
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {event.status === 'DRAFT' && <PublishEventButton eventId={event.id} />}
              <Link to={`/my-events/${event.id}/edit`}>
                <Button variant="secondary" size="sm">Ред.</Button>
              </Link>
              <Link to={`/my-events/${event.id}/participants`}>
                <Button variant="ghost" size="sm">Участники</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                loading={deleteMutation.isPending}
                onClick={() => {
                  if (confirm('Отменить событие?')) deleteMutation.mutate(event.id)
                }}
              >
                Отменить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
