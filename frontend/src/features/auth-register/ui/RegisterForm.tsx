import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi, usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import type { RegisterDto } from '@entities/user'

export function RegisterForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterDto>({ defaultValues: { role: 'PARTICIPANT' } })

  const mutation = useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const tokens = await authApi.register(dto)
      setTokens(tokens)
      const user = await usersApi.me()
      setUser(user)
      return user
    },
    onSuccess: (user) => {
      if (user.role === 'ORGANIZER') navigate('/dashboard')
      else navigate('/')
    },
    onError: () => {
      setError('email', { message: 'Email уже используется или ошибка сервера' })
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Имя"
          placeholder="Иван"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'Обязательное поле' })}
        />
        <Input
          label="Фамилия"
          placeholder="Иванов"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Обязательное поле' })}
        />
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Обязательное поле' })}
      />
      <Input
        label="Телефон (необязательно)"
        type="tel"
        placeholder="+998901234567"
        {...register('phone')}
      />
      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Обязательное поле', minLength: { value: 8, message: 'Мин. 8 символов' } })}
      />
      <Select
        label="Роль"
        options={[
          { value: 'PARTICIPANT', label: 'Участник' },
          { value: 'ORGANIZER', label: 'Организатор' },
        ]}
        {...register('role')}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Создать аккаунт
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Войти
        </Link>
      </p>
    </form>
  )
}
