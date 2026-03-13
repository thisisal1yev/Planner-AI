import { LoginForm } from '@features/auth-by-credentials'

export function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Вход</h2>
        <p className="text-sm text-muted-foreground mt-1">Войдите в свой аккаунт</p>
      </div>
      <LoginForm />
    </>
  )
}
