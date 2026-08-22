/**
 * LuxeCraft — Database Seed
 * Phase 2: Creates initial Super Admin account and schema version record.
 *
 * USAGE:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass123! npx ts-node prisma/seed.ts
 *
 * Or set ADMIN_EMAIL / ADMIN_PASSWORD in your .env before running:
 *   npm run db:seed
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Schema version ────────────────────────────────────────
  await prisma.schemaVersion.upsert({
    where: { version: '2.0.0' },
    update: {},
    create: {
      version: '2.0.0',
      description: 'Phase 2 — Authentication & Secure Admin Foundation',
    },
  });

  // ── Super Admin ───────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@luxecraft.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'LuxeCraft@Admin1!';
  const adminFirst = process.env.ADMIN_FIRST_NAME ?? 'Super';
  const adminLast = process.env.ADMIN_LAST_NAME ?? 'Admin';

  const existing = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`Super Admin already exists: ${adminEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: adminFirst,
        lastName: adminLast,
      },
    });
    console.log(`Super Admin created: ${admin.email} (id: ${admin.id})`);
    console.log('⚠  Change the default password immediately after first login!');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
