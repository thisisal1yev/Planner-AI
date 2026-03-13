import type { EventStatus } from '@shared/types'

export interface TicketTier {
  id: string
  eventId: string
  name: string
  price: number
  quantity: number
  sold: number
  createdAt: string
}

export interface Event {
  id: string
  organizerId: string
  organizer?: import('../../user/model/types').User
  title: string
  description?: string
  bannerUrl?: string
  startDate: string
  endDate: string
  eventType: string
  capacity: number
  status: EventStatus
  venueId?: string
  venue?: import('../../venue/model/types').Venue
  ticketTiers?: TicketTier[]
  createdAt: string
  updatedAt: string
}
