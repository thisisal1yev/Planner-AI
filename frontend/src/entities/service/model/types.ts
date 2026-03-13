import type { ServiceCategory, BookingStatus } from '@shared/types'

export interface Service {
  id: string
  vendorId?: string
  name: string
  category: ServiceCategory
  description?: string
  priceFrom: number
  rating: number
  imageUrls: string[]
  city: string
  createdAt: string
}

export interface EventService {
  id: string
  eventId: string
  serviceId: string
  service?: Service
  status: BookingStatus
  agreedPrice: number
  createdAt: string
}
