import { apiClient } from './client'

export interface Category {
  id: string
  name: string
}

export const categoriesApi = {
  listEventCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/event-categories')
    return data.data
  },
  listServiceCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/service-categories')
    return data.data
  },
  listVenueCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/venue-categories')
    return data.data
  },
  createEventCategory: async (name: string): Promise<Category> => {
    const { data } = await apiClient.post('/event-categories', { name })
    return data.data
  },
  createServiceCategory: async (name: string): Promise<Category> => {
    const { data } = await apiClient.post('/service-categories', { name })
    return data.data
  },
  createVenueCategory: async (name: string): Promise<Category> => {
    const { data } = await apiClient.post('/venue-categories', { name })
    return data.data
  },
}
