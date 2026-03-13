import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { Button } from '@shared/ui/Button'

interface PublishEventButtonProps {
  eventId: string
}

export function PublishEventButton({ eventId }: PublishEventButtonProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => eventsApi.publish(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', eventId] })
    },
  })

  return (
    <Button onClick={() => mutation.mutate()} loading={mutation.isPending} size="sm">
      Опубликовать
    </Button>
  )
}
