import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { Spinner } from '@shared/ui/Spinner'

export function EventParticipantsPage() {
  const { id } = useParams<{ id: string }>()

  const { data: participants, isLoading } = useQuery({
    queryKey: ['event-participants', id],
    queryFn: () => eventsApi.participants(id!),
    enabled: !!id,
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Участники события</h1>
      <p className="text-sm text-gray-500">Всего: {participants?.length ?? 0}</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Имя</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Телефон</th>
            </tr>
          </thead>
          <tbody>
            {participants?.map((user, i) => (
              <tr key={user.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3 text-gray-500">{user.phone ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {participants?.length === 0 && (
          <p className="text-center text-gray-400 py-8">Нет участников</p>
        )}
      </div>
    </div>
  )
}
