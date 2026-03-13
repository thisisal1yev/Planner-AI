export interface DashboardStats {
  organizerId: string
  totalEvents: number
  publishedEvents: number
  totalTicketsSold: number
  totalRevenue: number
  totalCommission: number
  upcomingEvents: number
}

export interface TierStats {
  tierId: string
  name: string
  price: number
  quantity: number
  sold: number
  revenue: number
}

export interface EventStats {
  eventId: string
  title: string
  totalTickets: number
  soldTickets: number
  totalRevenue: number
  platformCommission: number
  attendanceRate: number
  tierBreakdown: TierStats[]
}
