import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'

interface LoginForm {
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<LoginForm>()

  const onSubmit = (data: LoginForm) => {
    console.log('Login:', data)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Вход</h1>
          <p className="text-gray-500 mt-2">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: true })}
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            {...register('password', { required: true })}
          />

          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
