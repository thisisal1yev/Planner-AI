import { StarRating } from '@shared/ui/StarRating'
import type { Review } from '../model/types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
            {review.author ? `${review.author.firstName[0]}${review.author.lastName[0]}` : '?'}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {review.author ? `${review.author.firstName} ${review.author.lastName}` : 'Аноним'}
          </span>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <StarRating rating={review.rating} />
      {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
    </div>
  )
}
