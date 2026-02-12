import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export class AdoptionRequestService {
  async createRequest(adopterId: string, animalId: string, slotId: string, date: string) {
    // 1. Check profile completeness
    const profile = await prisma.adopterProfile.findUnique({
      where: { user_id: adopterId }
    });

    if (!profile || profile.status !== 'COMPLETED') {
      throw new Error('PROFILE_INCOMPLETE');
    }

    // 2. Check animal availability
    const animal = await prisma.animal.findUnique({
      where: { id: animalId }
    });

    if (!animal || animal.status !== 'AVAILABLE') {
      throw new Error('ANIMAL_NOT_AVAILABLE');
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // 3. Perform booking in a transaction with optimistic locking
    return prisma.$transaction(async (tx) => {
      // Fetch the slot
      const slot = await tx.visitSlot.findUnique({
        where: { id: slotId }
      });

      if (!slot) {
        throw new Error('SLOT_NOT_FOUND');
      }

      // Check capacity
      if (slot.current_bookings >= slot.capacity) {
        throw new Error('SLOT_FULL');
      }

      // Update slot with optimistic lock
      const updatedSlot = await tx.visitSlot.update({
        where: {
          id: slotId,
          version: slot.version // Version check
        },
        data: {
          current_bookings: { increment: 1 },
          version: { increment: 1 }
        }
      });

      if (!updatedSlot) {
        throw new Error('CONCURRENCY_ERROR');
      }

      // Create the Adoption Request
      const request = await tx.adoptionRequest.create({
        data: {
          adopter_id: adopterId,
          animal_id: animalId,
          status: 'PENDING'
        }
      });

      // Create the Visit Booking
      await tx.visitBooking.create({
        data: {
          visit_slot_id: slotId,
          adoption_request_id: request.id,
          status: 'SCHEDULED'
        }
      });

      return request;
    });
  }

  async getMyRequests(adopterId: string) {
    return prisma.adoptionRequest.findMany({
      where: { adopter_id: adopterId },
      include: {
        animal: true,
        bookings: {
          include: {
            visit_slot: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async listRequests(filters: { status?: string; species?: string; adopter_name?: string }, pagination: { page: number; limit: number }) {
    const { status, species, adopter_name } = filters;
    const { page, limit } = pagination;

    const where: Prisma.AdoptionRequestWhereInput = {};
    if (status) where.status = status;
    if (species) where.animal = { species };
    if (adopter_name) {
      where.adopter = {
        adopter_profile: {
          full_name: { contains: adopter_name }
        }
      };
    }

    const [total, items] = await Promise.all([
      prisma.adoptionRequest.count({ where }),
      prisma.adoptionRequest.findMany({
        where,
        include: {
          adopter: {
            include: {
              adopter_profile: true
            }
          },
          animal: true,
          bookings: {
            include: {
              visit_slot: true
            }
          }
        },
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

  async updateRequestStatus(requestId: string, status: string, notes?: string) {
    if (status === 'APPROVED' && !notes?.trim()) {
      throw new Error('NOTES_REQUIRED_FOR_APPROVAL');
    }

    return prisma.$transaction(async (tx) => {
      const request = await tx.adoptionRequest.update({
        where: { id: requestId },
        data: {
          status: status as any,
          visit_notes: notes
        },
        include: { animal: true }
      });

      // If approved, mark animal as ADOPTED
      if (status === 'APPROVED') {
        await tx.animal.update({
          where: { id: request.animal_id },
          data: { status: 'ADOPTED' }
        });

        // Auto-reject other pending requests for this animal
        await tx.adoptionRequest.updateMany({
          where: {
            animal_id: request.animal_id,
            id: { not: requestId },
            status: 'PENDING'
          },
          data: { status: 'REJECTED_AUTO' }
        });
      }

      return request;
    });
  }

  async cancelRequest(requestId: string, userId: string) {
    const request = await prisma.adoptionRequest.findFirst({
      where: { id: requestId, adopter_id: userId },
      include: { bookings: { include: { visit_slot: true } } }
    });

    if (!request) throw new Error('REQUEST_NOT_FOUND');
    if (request.status === 'CANCELLED') return request;

    const booking = request.bookings[0];
    if (booking) {
      const startTime = new Date(booking.visit_slot.start_time).getTime();
      const now = Date.now();
      const twoHoursInMs = 2 * 60 * 60 * 1000;

      if (startTime - now < twoHoursInMs) {
        throw new Error('CANCELLATION_WINDOW_EXPIRED');
      }
    }

    return prisma.$transaction(async (tx) => {
      // Update request status
      const updatedRequest = await tx.adoptionRequest.update({
        where: { id: requestId },
        data: { status: 'CANCELLED' }
      });

      // Update booking status
      if (booking) {
        await tx.visitBooking.update({
          where: { id: booking.id },
          data: { status: 'CANCELLED' }
        });

        // Decrement slot current_bookings
        await tx.visitSlot.update({
          where: { id: booking.visit_slot_id },
          data: {
            current_bookings: { decrement: 1 },
            version: { increment: 1 }
          }
        });
      }

      return updatedRequest;
    });
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return prisma.visitBooking.update({
      where: { id: bookingId },
      data: { status: status as any }
    });
  }
}
