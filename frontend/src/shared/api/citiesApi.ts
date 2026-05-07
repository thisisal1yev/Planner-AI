import { apiClient } from './client'

export const citiesApi = {
  listCities: async (): Promise<{ value: string; label: string }[]> => {
    const { data } = await apiClient.get('/cities')
    return (data.data as { name: string }[]).map((c) => ({ value: c.name, label: c.name }))
  },
  createCity: async (name: string): Promise<{ value: string; label: string }> => {
    const { data } = await apiClient.post('/cities', { name })
    return { value: data.data.name, label: data.data.name }
  },
}
