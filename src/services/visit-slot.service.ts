import { prisma } from '../lib/prisma';
import { Prisma, VisitSlotTemplate } from '@prisma/client';

export class VisitSlotService {
  /**
   * List all visit slot templates
   */
  async listTemplates(isActive?: boolean) {
    const where: Prisma.VisitSlotTemplateWhereInput = {};
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    return prisma.visitSlotTemplate.findMany({
      where,
      include: {
        created_by: true
      },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' }
      ]
    });
  }

  /**
   * Create a new visit slot template
   */
  async createTemplate(data: {
    created_by_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    capacity_per_slot?: number;
  }) {
    return prisma.visitSlotTemplate.create({
      data: {
        ...data,
        capacity_per_slot: data.capacity_per_slot ?? 1
      },
      include: {
        created_by: true
      }
    });
  }

  /**
   * Update an existing visit slot template
   */
  async updateTemplate(id: string, data: Prisma.VisitSlotTemplateUpdateInput) {
    return prisma.visitSlotTemplate.update({
      where: { id },
      data,
      include: {
        created_by: true
      }
    });
  }

  /**
   * Delete a visit slot template
   */
  async deleteTemplate(id: string) {
    return prisma.visitSlotTemplate.delete({
      where: { id }
    });
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string) {
    return prisma.visitSlotTemplate.findUnique({
      where: { id },
      include: {
        created_by: true
      }
    });
  }

  /**
   * Generate daily slots based on active templates for the next N days.
   * Idempotent: Does not create duplicate slots for the same template and date.
   */
  async generateDailySlots(daysAhead: number = 7) {
    console.log(`[VisitSlotService] Starting slot generation for next ${daysAhead} days...`);

    const activeTemplates = await this.listTemplates(true);
    const results = { created: 0, skipped: 0 };

    for (let i = 1; i <= daysAhead; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      targetDate.setHours(0, 0, 0, 0);

      const dayOfWeek = this.getDayOfWeekString(targetDate);

      const templatesForDay = activeTemplates.filter((t: VisitSlotTemplate) =>
        t.day_of_week === 'ALL' || t.day_of_week === dayOfWeek
      );

      for (const template of templatesForDay) {
        // Check if slot already exists for this template and date
        const existingSlot = await prisma.visitSlot.findFirst({
          where: {
            template_id: template.id,
            date: targetDate
          }
        });

        if (existingSlot) {
          results.skipped++;
          continue;
        }

        // Parse start/end times "HH:mm:ss"
        const [sH, sM, sS] = template.start_time.split(':').map(Number);
        const [eH, eM, eS] = template.end_time.split(':').map(Number);

        const startTime = new Date(targetDate);
        startTime.setHours(sH, sM, sS, 0);

        const endTime = new Date(targetDate);
        endTime.setHours(eH, eM, eS, 0);

        await prisma.visitSlot.create({
          data: {
            template_id: template.id,
            date: targetDate,
            start_time: startTime,
            end_time: endTime,
            capacity: template.capacity_per_slot,
            current_bookings: 0,
            version: 0
          }
        });
        results.created++;
      }
    }

    console.log(`[VisitSlotService] Logic completed. Created: ${results.created}, Skipped: ${results.skipped}`);
    return results;
  }

  /**
   * Get available slots for a specific date
   */
  async getAvailableSlots(date: string) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return prisma.visitSlot.findMany({
      where: {
        date: targetDate,
        current_bookings: {
          lt: prisma.visitSlot.fields.capacity
        }
      },
      orderBy: { start_time: 'asc' }
    });
  }

  private getDayOfWeekString(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }
}
