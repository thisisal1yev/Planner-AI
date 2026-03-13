import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import type { UpdateUserDto } from '@entities/user'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    values: data ? { firstName: data.firstName, lastName: data.lastName, phone: data.phone } : undefined,
  })

  const mutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated)
      if (user) setUser({ id: user.id, email: user.email, role: user.role })
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Профиль</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">Email</p>
        <p className="font-medium text-gray-900">{data?.email}</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Редактировать данные</h2>
        <Input
          label="Имя"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'Обязательное поле' })}
        />
        <Input
          label="Фамилия"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Обязательное поле' })}
        />
        <Input label="Телефон" {...register('phone')} />
        {mutation.isSuccess && <p className="text-sm text-green-600">Данные сохранены</p>}
        {mutation.isError && <p className="text-sm text-red-500">Ошибка при сохранении</p>}
        <Button type="submit" loading={mutation.isPending}>Сохранить</Button>
      </form>
    </div>
  )
}
