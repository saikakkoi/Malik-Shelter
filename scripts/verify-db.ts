import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

// Database path - matches prisma.config.ts
const dbPath = path.join(__dirname, '..', 'dev.db');

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== Database Verification ===\n');
  console.log('Database path:', dbPath);

  // Count animals
  const animalCount = await prisma.animal.count();
  console.log(`\nTotal Animals: ${animalCount}`);

  // List all animals
  const animals = await prisma.animal.findMany({
    include: { photos: true }
  });

  console.log('\n--- Animals ---');
  for (const animal of animals) {
    console.log(`\nID: ${animal.id}`);
    console.log(`${animal.name} (${animal.species} - ${animal.breed})`);
    console.log(`  Status: ${animal.status}`);
    console.log(`  Age: ${animal.age_months} months`);
    console.log(`  Photos: ${animal.photos.length}`);
  }

  // Count photos
  const photoCount = await prisma.animalPhoto.count();
  console.log(`\n\nTotal Photos: ${photoCount}`);

  console.log('\n=== Verification Complete ===');
}

main()
  .catch((e) => {
    console.error('Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
