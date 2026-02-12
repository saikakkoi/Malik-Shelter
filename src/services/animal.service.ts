import { prisma } from '../lib/prisma';
import { Animal, Prisma } from '@prisma/client';

export class AnimalService {
  async createAnimal(data: Prisma.AnimalCreateInput) {
    return prisma.animal.create({
      data,
      include: { photos: true }
    });
  }

  async updateAnimal(id: string, data: Prisma.AnimalUpdateInput) {
    return prisma.animal.update({
      where: { id },
      data,
      include: { photos: true }
    });
  }

  async archiveAnimal(id: string) {
    return prisma.animal.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
  }

  async getAnimalById(id: string) {
    return prisma.animal.findUnique({
      where: { id },
      include: { photos: true }
    });
  }

  async searchAnimals(filters: any, pagination: { page: number; limit: number }) {
    const { species, gender, breed, min_age, max_age, status } = filters;
    const { page, limit } = pagination;

    const where: Prisma.AnimalWhereInput = {};
    if (species) where.species = species;
    if (gender) where.gender = gender;
    if (breed) where.breed = { contains: breed };

    // Status Logic:
    // If 'all', don't filter by status (staff inventory)
    // If explicit status, use it
    // Default (public search): AVAILABLE or PENDING
    if (status && status !== 'all') {
      where.status = status;
    } else if (status === 'all') {
      // No status filter
    } else {
      where.status = { in: ['AVAILABLE', 'PENDING'] };
    }

    if (min_age || max_age) {
      where.age_months = {};
      if (min_age) where.age_months.gte = parseInt(min_age);
      if (max_age) where.age_months.lte = parseInt(max_age);
    }

    const [total, items] = await Promise.all([
      prisma.animal.count({ where }),
      prisma.animal.findMany({
        where,
        include: { photos: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ]);

    return {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      items
    };
  }

  async getRecommendations(animalId: string, limit: number = 3) {
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal) return [];

    // Simple recommendation: other animals of the same species, excluding itself
    return prisma.animal.findMany({
      where: {
        species: animal.species,
        id: { not: animalId },
        status: 'AVAILABLE'
      },
      include: { photos: true },
      take: limit,
      orderBy: { created_at: 'desc' }
    });
  }
}
