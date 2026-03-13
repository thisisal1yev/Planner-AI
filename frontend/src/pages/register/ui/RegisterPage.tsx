import { RegisterForm } from '@features/auth-register'

export function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Регистрация</h2>
        <p className="text-sm text-muted-foreground mt-1">Создайте новый аккаунт</p>
      </div>
      <RegisterForm />
    </>
  )
}
