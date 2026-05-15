import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Home, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@shared/model/auth.store'

const NAV = [
  { label: 'Bu qanday ishlaydi', href: '/#how-it-works' },
  { label: 'Imkoniyatlar', href: '/#features' },
  { label: 'Tariflar', href: '/#pricing' },
  { label: 'Aloqa', href: '/#contact' },
]

function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const dashboardHref =
    user.role === 'ADMIN'
      ? '/admin/dashboard'
      : user.role === 'ORGANIZER'
        ? '/dashboard'
        : user.role === 'VENDOR'
          ? '/my-venues'
          : '/events'

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        data-cursor-hover
        className="rounded-full transition-shadow outline-none focus:shadow-[0_0_0_3px_rgba(139,92,246,0.4)]"
        onClick={() => setOpen((v) => !v)}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName}
            className="h-9 w-9 rounded-full border-2 border-aurora-violet/40 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-aurora-violet to-aurora-pink text-xs font-bold text-white shadow-lg">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2.5 w-60 overflow-hidden rounded-2xl border border-white/10 bg-navy-2/95 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurora-violet to-aurora-pink text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="overflow-hidden text-sm font-semibold text-white text-ellipsis whitespace-nowrap">
                {user.firstName} {user.lastName}
              </p>
              <p className="overflow-hidden text-xs text-white/45 text-ellipsis whitespace-nowrap">
                {user.email}
              </p>
            </div>
          </div>

          <div className="py-2">
            {[
              { to: dashboardHref, label: 'Boshqaruv paneli', Icon: Home },
              { to: '/profile', label: 'Profil', Icon: User },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                data-cursor-hover
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 transition-[color,background] duration-150 hover:bg-aurora-violet/10 hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0 opacity-50" strokeWidth={1.5} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-white/8 py-2">
            <button
              onClick={handleLogout}
              data-cursor-hover
              className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 py-2.5 text-sm text-red-400/80 transition-[color,background] duration-150 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.5} />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-aurora-overlay="true"
      className={`sticky top-0 z-40 w-full border-b transition-all duration-500 ${
        scrolled
          ? 'border-white/10 bg-navy/80 backdrop-blur-xl'
          : 'border-transparent bg-transparent backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between gap-8 px-[clamp(24px,5vw,80px)]">
        <Link to={'/'} data-cursor-hover className="relative z-10 flex items-center">
          <span className="font-serif text-2xl font-bold tracking-tight text-white">Planner</span>
          <span className="ml-1 font-serif text-2xl font-bold tracking-tight text-aurora">AI</span>
        </Link>

        <div className="flex items-center justify-between gap-6">
          <nav className="hidden gap-8 md:flex">
            {NAV.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                data-cursor-hover
                className="group relative pb-0.5 text-sm text-white/65 transition-colors duration-200 hover:text-white"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-aurora-violet to-aurora-pink transition-[width] duration-300 ease-in-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  data-cursor-hover
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:bg-white/5"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  data-cursor-hover
                  className="rounded-full bg-gradient-to-r from-aurora-violet via-aurora-pink to-aurora-orange px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(236,72,153,0.6)] transition-all duration-300 hover:shadow-[0_14px_36px_-8px_rgba(236,72,153,0.8)]"
                >
                  Boshlash
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
