import type { BookingStatus, RatingStats } from '@shared/types'

export interface VenueCategory {
  id: string
  name: string
}

export interface Venue {
  id: string
  ownerId: string
  categoryId: string
  category?: VenueCategory
  owner?: { id: string; firstName: string; lastName: string }
  name: string
  description?: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  capacity: number
  pricePerDay: number
  characteristics?: { id: string; name: string }[]
  imageUrls: string[]
  ratingStats?: RatingStats
  createdAt: string
}

export interface VenueBooking {
  id: string
  venueId: string
  venue?: Venue
  eventServiceId?: string
  userId: string
  startDate: string
  endDate: string
  status: BookingStatus
  totalCost: number
  createdAt: string
}
