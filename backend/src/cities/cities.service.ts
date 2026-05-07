import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  listCities() {
    return this.prisma.city.findMany({ orderBy: { name: 'asc' } });
  }

  findOrCreateCity(name: string) {
    const normalized = name.trim();
    return this.prisma.city.upsert({
      where: { name: normalized },
      update: {},
      create: { name: normalized },
    });
  }
}
