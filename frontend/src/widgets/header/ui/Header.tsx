import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@shared/model/auth.store'
import { authApi } from '@entities/user'
import { Button } from '@shared/ui/Button'

export function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      navigate('/login')
    },
  })

  const navLinks = () => {
    if (!user) return null
    if (user.role === 'ORGANIZER')
      return (
        <>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Дашборд</Link>
          <Link to="/my-events" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Мои события</Link>
        </>
      )
    if (user.role === 'VENDOR')
      return (
        <>
          <Link to="/my-venues" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Мои площадки</Link>
          <Link to="/my-services" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Мои услуги</Link>
        </>
      )
    if (user.role === 'ADMIN')
      return <Link to="/admin/users" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Пользователи</Link>
    return <Link to="/tickets" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Мои билеты</Link>
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-indigo-600 text-lg tracking-tight">
          Planner AI
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/events" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">События</Link>
          <Link to="/venues" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Площадки</Link>
          <Link to="/services" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Услуги</Link>
          {navLinks()}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile" className="text-sm text-gray-600 hover:text-indigo-600 hidden md:block">
                {user.email}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                loading={logoutMutation.isPending}
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Войти</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
