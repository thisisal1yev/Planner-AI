import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  listEventCategories() {
    return this.prisma.eventCategory.findMany({ orderBy: { name: 'asc' } });
  }

  listServiceCategories() {
    return this.prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } });
  }

  listVenueCategories() {
    return this.prisma.venueCategory.findMany({ orderBy: { name: 'asc' } });
  }

  findOrCreateEventCategory(name: string) {
    const n = name.trim();
    return this.prisma.eventCategory.upsert({ where: { name: n }, update: {}, create: { name: n } });
  }

  findOrCreateServiceCategory(name: string) {
    const n = name.trim();
    return this.prisma.serviceCategory.upsert({ where: { name: n }, update: {}, create: { name: n } });
  }

  findOrCreateVenueCategory(name: string) {
    const n = name.trim();
    return this.prisma.venueCategory.upsert({ where: { name: n }, update: {}, create: { name: n } });
  }
}
