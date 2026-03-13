import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { PurchaseTicketForm } from '@features/ticket-purchase'
import { ApplyVolunteerForm } from '@features/volunteer-apply'
import { CreateReviewForm } from '@features/review-create'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Modal } from '@shared/ui/Modal'
import { useAuthStore } from '@shared/model/auth.store'

const statusColor: Record<string, 'green' | 'gray' | 'red' | 'indigo'> = {
  PUBLISHED: 'green', DRAFT: 'gray', CANCELLED: 'red', COMPLETED: 'indigo',
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [volunteerModal, setVolunteerModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.get(id!),
    enabled: !!id,
  })

  const { data: reviews } = useQuery({
    queryKey: ['event-reviews', id],
    queryFn: () => reviewsApi.forEvent(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!event) return <div className="text-center py-16 text-gray-400">Событие не найдено</div>

  const start = new Date(event.startDate).toLocaleString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  const end = new Date(event.endDate).toLocaleString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="flex flex-col gap-6">
      <Link to="/events">
        <Button variant="ghost" size="sm">← Все события</Button>
      </Link>

      {/* Banner */}
      {event.bannerUrl ? (
        <img src={event.bannerUrl} alt={event.title} className="w-full h-72 object-cover rounded-2xl" />
      ) : (
        <div className="w-full h-72 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
          <svg className="h-20 w-20 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">{event.title}</h1>
              <Badge color={statusColor[event.status]}>{event.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {start}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.capacity} мест
              </span>
              <span>{event.eventType}</span>
            </div>
          </div>

          {event.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Описание</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {event.venue && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Место проведения</h2>
              <Link to={`/venues/${event.venue.id}`} className="text-indigo-600 hover:underline font-medium">
                {event.venue.name}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{event.venue.city}, {event.venue.address}</p>
            </div>
          )}

          {/* Dates */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Расписание</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Начало</span>
                <span className="font-medium text-gray-900">{start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Конец</span>
                <span className="font-medium text-gray-900">{end}</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Отзывы</h2>
              {user && (
                <Button variant="secondary" size="sm" onClick={() => setReviewModal(true)}>
                  Написать отзыв
                </Button>
              )}
            </div>
            {reviews?.data.length === 0 ? (
              <p className="text-gray-400 text-sm">Пока нет отзывов</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews?.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: ticket purchase */}
        <div className="flex flex-col gap-4">
          {event.status === 'PUBLISHED' && event.ticketTiers && event.ticketTiers.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Купить билет</h2>
              {user ? (
                <PurchaseTicketForm eventId={event.id} tiers={event.ticketTiers} />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">Войдите, чтобы купить билет</p>
                  <Link to="/login"><Button className="w-full">Войти</Button></Link>
                </div>
              )}
            </div>
          )}

          {event.status === 'PUBLISHED' && user && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Стать волонтёром</h2>
              <p className="text-sm text-gray-500 mb-4">Помогите с организацией мероприятия</p>
              <Button variant="secondary" className="w-full" onClick={() => setVolunteerModal(true)}>
                Подать заявку
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Modal */}
      <Modal open={volunteerModal} onClose={() => setVolunteerModal(false)} title="Заявка волонтёра">
        <ApplyVolunteerForm eventId={event.id} onSuccess={() => setVolunteerModal(false)} />
      </Modal>

      {/* Review Modal */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Написать отзыв">
        <CreateReviewForm
          eventId={event.id}
          queryKey={['event-reviews', id!]}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>

    </div>
  )
}
