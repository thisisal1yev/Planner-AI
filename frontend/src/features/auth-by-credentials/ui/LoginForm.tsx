import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@entities/user'
import { usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import type { LoginDto } from '@entities/user'
import type { AuthUser } from '@shared/types'

export function LoginForm() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginDto>()

  const mutation = useMutation({
    mutationFn: async (dto: LoginDto) => {
      const tokens = await authApi.login(dto)
      setTokens(tokens)
      const user = await usersApi.me()
      setTokens(tokens, user as unknown as AuthUser)
      return user
    },
    onSuccess: (user) => {
      const role = (user as { role: string }).role
      if (role === 'ORGANIZER') navigate('/dashboard')
      else if (role === 'ADMIN') navigate('/admin/users')
      else navigate('/')
    },
    onError: () => {
      setError('password', { message: 'Неверный email или пароль' })
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Обязательное поле' })}
      />
      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Обязательное поле', minLength: { value: 8, message: 'Мин. 8 символов' } })}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Войти
      </Button>
      <p className="text-sm text-center text-gray-500">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  )
}
