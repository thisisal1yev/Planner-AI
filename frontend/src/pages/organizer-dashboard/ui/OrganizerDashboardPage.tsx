import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { analyticsApi } from '@entities/analytics'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'

function StatCard({ label, value, color = 'indigo' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 text-${color}-600`}>{value}</p>
    </div>
  )
}

export function OrganizerDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: analyticsApi.dashboard,
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <Link to="/my-events/create">
          <Button>+ Создать событие</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Всего событий" value={stats?.totalEvents ?? 0} />
        <StatCard label="Опубликованных" value={stats?.publishedEvents ?? 0} color="green" />
        <StatCard label="Предстоящих" value={stats?.upcomingEvents ?? 0} color="blue" />
        <StatCard label="Билетов продано" value={stats?.totalTicketsSold ?? 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Общая выручка</p>
          <p className="text-3xl font-bold text-gray-900">${stats?.totalRevenue?.toFixed(2) ?? '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Комиссия платформы</p>
          <p className="text-3xl font-bold text-gray-900">${stats?.totalCommission?.toFixed(2) ?? '0.00'}</p>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl p-5">
        <p className="font-medium text-indigo-900 mb-3">Быстрые действия</p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/my-events/create"><Button>Создать событие</Button></Link>
          <Link to="/my-events"><Button variant="secondary">Мои события</Button></Link>
        </div>
      </div>
    </div>
  )
}
