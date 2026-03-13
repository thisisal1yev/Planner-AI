import { apiClient } from '@shared/api/client'
import type { PaymentProvider } from '@shared/types'
import type { Ticket } from '../model/types'

export const ticketsApi = {
  purchase: async (eventId: string, dto: { tierId: string; provider: PaymentProvider }): Promise<Ticket> => {
    const { data } = await apiClient.post(`/events/${eventId}/tickets/purchase`, dto)
    return data.data
  },
  myTickets: async (): Promise<Ticket[]> => {
    const { data } = await apiClient.get('/tickets/my')
    return data.data
  },
  get: async (id: string): Promise<Ticket> => {
    const { data } = await apiClient.get(`/tickets/${id}`)
    return data.data
  },
  validate: async (qrCode: string): Promise<{ valid: boolean; ticket?: Ticket }> => {
    const { data } = await apiClient.post('/tickets/validate', { qrCode })
    return data.data
  },
}
