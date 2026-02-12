import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

// Database path matches prisma.config.ts (project root dev.db)
const dbPath = path.join(__dirname, '../../dev.db');
const database = new Database(dbPath);

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`
});

export const prisma = new PrismaClient({ adapter });

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  database.close();
  process.exit(0);
});
