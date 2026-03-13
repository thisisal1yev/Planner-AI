import type { User } from '../../user/model/types'

export interface Review {
  id: string
  authorId: string
  author?: User
  eventId?: string
  venueId?: string
  serviceId?: string
  rating: number
  comment?: string
  createdAt: string
}
