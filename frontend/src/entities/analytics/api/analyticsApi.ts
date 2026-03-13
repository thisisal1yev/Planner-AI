import { apiClient } from '@shared/api/client'
import type { DashboardStats, EventStats } from '../model/types'

export const analyticsApi = {
  dashboard: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/analytics/dashboard')
    return data.data
  },
  eventStats: async (eventId: string): Promise<EventStats> => {
    const { data } = await apiClient.get(`/analytics/events/${eventId}`)
    return data.data
  },
}
