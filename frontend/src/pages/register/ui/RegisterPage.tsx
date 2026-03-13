import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<RegisterForm>()

  const onSubmit = (data: RegisterForm) => {
    console.log('Register:', data)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-500 mt-2">Создайте аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Имя"
            type="text"
            placeholder="Иван"
            {...register('firstName', { required: true })}
          />
          <Input
            label="Фамилия"
            type="text"
            placeholder="Иванов"
            {...register('lastName', { required: true })}
          />
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
            {...register('password', { required: true, minLength: 6 })}
          />
          <Input
            label="Подтвердите пароль"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword', { required: true })}
          />

          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
