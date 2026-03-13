import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@entities/user'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Pagination } from '@shared/ui/Pagination'
import { Spinner } from '@shared/ui/Spinner'

const roleColor: Record<string, 'indigo' | 'green' | 'blue' | 'yellow' | 'gray'> = {
  ADMIN: 'indigo', ORGANIZER: 'green', VENDOR: 'blue', VOLUNTEER: 'yellow', PARTICIPANT: 'gray',
}

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users', { page, search }],
    queryFn: () => usersApi.list({ page, limit: 20, search: search || undefined }),
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>

      <Input
        placeholder="Поиск по имени или email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        className="max-w-sm"
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Имя</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Роль</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Дата</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data?.data.map((user, i) => (
                  <tr key={user.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge color={roleColor[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deleteMutation.isPending}
                        onClick={() => { if (confirm('Удалить пользователя?')) deleteMutation.mutate(user.id) }}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data.length === 0 && (
              <p className="text-center text-gray-400 py-8">Пользователи не найдены</p>
            )}
          </div>
          {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
