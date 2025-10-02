import { PrismaClient, UserRole, ElectoralLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create SUPER_ADMIN user
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@etally.ke' },
    update: {},
    create: {
      email: 'superadmin@etally.ke',
      username: 'superadmin',
      password: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('✅ SUPER_ADMIN user created:', superAdmin.email);

  // Create Electoral Positions
  const electoralPositions = [
    {
      name: 'The President',
      description: 'President of the Republic of Kenya',
      level: ElectoralLevel.NATIONAL,
    },
    {
      name: 'Member of National Assembly',
      description: 'Member of Parliament representing a constituency',
      level: ElectoralLevel.CONSTITUENCY,
    },
    {
      name: 'Senator',
      description: 'Senator representing a county',
      level: ElectoralLevel.COUNTY,
    },
    {
      name: 'County Woman Member of National Assembly',
      description: 'Woman Representative for a county',
      level: ElectoralLevel.COUNTY,
    },
    {
      name: 'County Governor',
      description: 'Governor of a county',
      level: ElectoralLevel.COUNTY,
    },
    {
      name: 'Member of County Assembly',
      description: 'MCA representing a county electoral ward',
      level: ElectoralLevel.WARD,
    },
  ];

  console.log('🏛️ Creating electoral positions...');

  for (const position of electoralPositions) {
    const createdPosition = await prisma.electoralPosition.upsert({
      where: { name: position.name },
      update: {},
      create: position,
    });
    console.log(`✅ Electoral position created: ${createdPosition.name}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
