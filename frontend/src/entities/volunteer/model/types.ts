import type { VolunteerStatus } from '@shared/types'
import type { User } from '../../user/model/types'
import type { Event } from '../../event/model/types'

export interface VolunteerApplication {
  id: string
  userId: string
  user?: User
  eventId: string
  event?: Event
  skills: string[]
  status: VolunteerStatus
  createdAt: string
}
