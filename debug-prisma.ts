import { prisma } from './src/lib/prisma';

console.log('--- Prisma Model Keys ---');
console.log(Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
process.exit(0);
