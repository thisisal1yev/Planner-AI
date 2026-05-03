import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import {
  VENUE_CATEGORIES,
  SERVICE_CATEGORIES,
  EVENT_CATEGORIES,
  VOLUNTEER_SKILLS,
  VENUE_CHARACTERISTICS,
} from '../fixtures/reference.fixture';

export async function seedReference(prisma: PrismaClient, registry: SeedRegistry): Promise<void> {
  for (const name of VENUE_CATEGORIES) {
    const c = await prisma.venueCategory.create({ data: { name } });
    registry.setVenueCategory(name, c.id);
  }

  for (const name of SERVICE_CATEGORIES) {
    const c = await prisma.serviceCategory.create({ data: { name } });
    registry.setServiceCategory(name, c.id);
  }

  for (const name of EVENT_CATEGORIES) {
    const c = await prisma.eventCategory.create({ data: { name } });
    registry.setEventCategory(name, c.id);
  }

  for (const name of VOLUNTEER_SKILLS) {
    const s = await prisma.volunteerSkill.create({ data: { name } });
    registry.setVolunteerSkill(name, s.id);
  }

  for (const name of VENUE_CHARACTERISTICS) {
    const s = await prisma.venueCharacteristic.create({ data: { name } });
    registry.setVenueCharacteristic(name, s.id);
  }

  console.log('✅ Reference data seeded');
}
