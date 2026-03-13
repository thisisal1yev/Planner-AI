import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { servicesApi } from '@entities/service'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Spinner } from '@shared/ui/Spinner'
import { Input } from '@shared/ui/Input'

export function EventServicesPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [attachOpen, setAttachOpen] = useState(false)
  const [serviceId, setServiceId] = useState('')
  const [price, setPrice] = useState('')

  const { data: attached, isLoading } = useQuery({
    queryKey: ['event-services', id],
    queryFn: () => eventsApi.services(id!),
    enabled: !!id,
  })

  const { data: allServices } = useQuery({
    queryKey: ['services-all'],
    queryFn: () => servicesApi.list({ limit: 100 }),
  })

  const attachMutation = useMutation({
    mutationFn: () => eventsApi.attachService(id!, { serviceId, agreedPrice: parseFloat(price) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-services', id] })
      setAttachOpen(false)
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Услуги события</h1>
        <Button onClick={() => setAttachOpen(true)}>+ Добавить услугу</Button>
      </div>

      <div className="flex flex-col gap-3">
        {attached?.map((es) => (
          <div key={es.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{es.service?.name}</p>
              <p className="text-sm text-gray-500">{es.service?.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-indigo-600">${es.agreedPrice}</span>
              <Badge color={es.status === 'CONFIRMED' ? 'green' : es.status === 'CANCELLED' ? 'red' : 'yellow'}>
                {es.status}
              </Badge>
            </div>
          </div>
        ))}
        {attached?.length === 0 && (
          <p className="text-center text-gray-400 py-8">Услуги не прикреплены</p>
        )}
      </div>

      <Modal open={attachOpen} onClose={() => setAttachOpen(false)} title="Добавить услугу">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Услуга</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Выберите услугу</option>
              {allServices?.data.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
              ))}
            </select>
          </div>
          <Input label="Согласованная цена ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          {attachMutation.isError && <p className="text-sm text-red-500">Ошибка при добавлении</p>}
          <Button
            onClick={() => attachMutation.mutate()}
            loading={attachMutation.isPending}
            disabled={!serviceId || !price}
          >
            Прикрепить
          </Button>
        </div>
      </Modal>
    </div>
  )
}
