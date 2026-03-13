import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi } from '@entities/event'
import { EventCard } from '@entities/event'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['events', { status: 'PUBLISHED', limit: 6 }],
    queryFn: () => eventsApi.list({ status: 'PUBLISHED', limit: 6 }),
  })

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Организуйте события
          <span className="text-primary"> без хлопот</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          Площадки, услуги, билеты — всё в одном месте для организаторов мероприятий Узбекистана.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/events">
            <Button size="lg">Смотреть события</Button>
          </Link>
          <Link to="/venues">
            <Button variant="secondary" size="lg">Найти площадку</Button>
          </Link>
        </div>
      </section>

      {/* Featured Events */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Ближайшие события</h2>
          <Link to="/events" className="text-sm text-primary hover:underline">Все события →</Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        {data?.data.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Нет доступных событий</p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary/10 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Вы организатор?</h2>
        <p className="text-muted-foreground mb-6">Создайте аккаунт организатора и запустите своё первое мероприятие</p>
        <Link to="/register">
          <Button>Начать бесплатно</Button>
        </Link>
      </section>
    </div>
  )
}
