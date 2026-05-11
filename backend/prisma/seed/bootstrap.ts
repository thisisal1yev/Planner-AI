import 'dotenv/config';
import { hashSync } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { Role } from '../../generated/prisma/enums';
import {
  EVENT_CATEGORIES,
  VENUE_CATEGORIES,
  SERVICE_CATEGORIES,
} from './fixtures/reference.fixture';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME ?? 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME ?? 'User';

  if (!email || !password) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD env vars are required');
    process.exit(1);
  }

  const existing = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (existing) {
    console.log(`ℹ️  Admin already exists (${existing.email}), skipping`);
  } else {
    const admin = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role: Role.ADMIN,
        passwordHash: hashSync(password, 10),
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`Admin created: ${admin.email}`);
  }

  const [ec, vc, sc] = await Promise.all([
    prisma.eventCategory.createMany({
      data: EVENT_CATEGORIES.map((name) => ({ name })),
      skipDuplicates: true,
    }),
    prisma.venueCategory.createMany({
      data: VENUE_CATEGORIES.map((name) => ({ name })),
      skipDuplicates: true,
    }),
    prisma.serviceCategory.createMany({
      data: SERVICE_CATEGORIES.map((name) => ({ name })),
      skipDuplicates: true,
    }),
  ]);
  console.log(
    `Categories seeded: ${ec.count} event, ${vc.count} venue, ${sc.count} service`,
  );
}

main()
  .catch((err) => {
    console.error('❌ Bootstrap failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
