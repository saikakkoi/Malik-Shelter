import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

// Database path - must match prisma.config.ts (file:./dev.db relative to project root)
// __dirname is prisma/, so we go up one level to project root
const dbPath = path.join(__dirname, '..', 'dev.db');

// Create Prisma adapter with database URL
const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`
});

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  console.log('Database path:', dbPath);

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.animalPhoto.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create staff user
  console.log('Creating staff user...');
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('secret', 10);

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@malikshelter.com',
      password_hash: passwordHash,
      role: 'STAFF',
      staff_profile: {
        create: {
          full_name: 'Malik Staff',
          department: 'Animal Care'
        }
      }
    }
  });
  console.log('Created staff user:', staffUser.email);

  // Create sample animals
  console.log('Creating animals...');

  const animal1 = await prisma.animal.create({
    data: {
      name: 'Luna',
      species: 'Cat',
      breed: 'Domestic Short Hair',
      gender: 'Female',
      age_months: 24,
      weight_kg: 4.5,
      bio: 'A sweet and calm cat looking for a quiet home.',
      origin: 'Found wandering near the park.',
      is_sterilized: true,
      medical_summary: 'Fully vaccinated. No known issues.',
      dietary_requirements: 'Dry food only.',
      energy_level: 'Low',
      social_compatibility: 'Good with other cats.',
      training_level: 'Litter trained.',
      status: 'AVAILABLE',
      photos: {
        create: [
          {
            photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
            is_main: true,
            sort_order: 1
          },
          {
            photo_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800',
            is_main: false,
            sort_order: 2
          }
        ]
      }
    }
  });
  console.log('Created animal:', animal1.name);

  const animal2 = await prisma.animal.create({
    data: {
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'Male',
      age_months: 36,
      weight_kg: 32.0,
      bio: 'Friendly giant who loves to play fetch.',
      origin: 'Surrendered by owner due to moving.',
      is_sterilized: true,
      medical_summary: 'Healthy. Regular heartworm prevention.',
      dietary_requirements: 'None.',
      energy_level: 'High',
      social_compatibility: 'Loves everyone.',
      training_level: 'Basic commands (sit, stay).',
      status: 'PENDING',
      photos: {
        create: [
          {
            photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
            is_main: true,
            sort_order: 1
          }
        ]
      }
    }
  });
  console.log('Created animal:', animal2.name);

  const animal3 = await prisma.animal.create({
    data: {
      name: 'Bella',
      species: 'Dog',
      breed: 'Beagle',
      gender: 'Female',
      age_months: 12,
      weight_kg: 10.0,
      bio: 'Energetic puppy, needs training.',
      origin: 'Born in shelter.',
      is_sterilized: false,
      medical_summary: 'Needs booster shots.',
      dietary_requirements: 'Puppy chow.',
      energy_level: 'High',
      social_compatibility: 'Needs socialization.',
      training_level: 'None.',
      status: 'AVAILABLE'
    }
  });
  console.log('Created animal:', animal3.name);

  console.log('Seeding finished! Created 3 animals.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
