import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'

const statusColor: Record<string, 'yellow' | 'green' | 'red'> = {
  PENDING: 'yellow', ACCEPTED: 'green', REJECTED: 'red',
}

export function EventVolunteersPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: applications, isLoading } = useQuery({
    queryKey: ['event-volunteers', id],
    queryFn: () => eventsApi.volunteers(id!),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      eventsApi.updateVolunteer(id!, appId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-volunteers', id] }),
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Заявки волонтёров</h1>

      <div className="flex flex-col gap-3">
        {applications?.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold">{app.user?.firstName} {app.user?.lastName}</p>
              <p className="text-sm text-gray-500">{app.user?.email}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {app.skills.map((s) => (
                  <span key={s} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={statusColor[app.status]}>{app.status}</Badge>
              {app.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    loading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ appId: app.id, status: 'ACCEPTED' })}
                  >
                    Принять
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ appId: app.id, status: 'REJECTED' })}
                  >
                    Отклонить
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        {applications?.length === 0 && (
          <p className="text-center text-gray-400 py-8">Нет заявок</p>
        )}
      </div>
    </div>
  )
}
