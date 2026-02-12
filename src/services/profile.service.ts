import { prisma } from '../lib/prisma';
import { AdopterProfile, Prisma } from '@prisma/client';
import { encrypt, decrypt } from '../utils/encryption';

export class ProfileService {
  /**
   * Mandatory fields required for a 'COMPLETED' status.
   */
  private readonly MANDATORY_FIELDS: (keyof AdopterProfile)[] = [
    'full_name',
    'phone',
    'address',
    'residence_type',
    'ownership_status',
    'outdoor_area',
    'resident_count'
  ];

  /**
   * Fields that are stored encrypted in the database.
   */
  private readonly ENCRYPTED_FIELDS: (keyof AdopterProfile)[] = [
    'phone',
    'address',
    'vet_references'
  ];

  async getProfile(userId: string) {
    const profile = await prisma.adopterProfile.findUnique({
      where: { user_id: userId },
      include: { home_photos: true }
    });

    if (!profile) return null;

    // Decrypt PII fields
    const decryptedProfile = { ...profile };
    this.ENCRYPTED_FIELDS.forEach(field => {
      if (typeof decryptedProfile[field] === 'string') {
        try {
          (decryptedProfile as any)[field] = decrypt(decryptedProfile[field] as string);
        } catch (e) {
          console.error(`Failed to decrypt field ${String(field)} for user ${userId}`);
        }
      }
    });

    return {
      ...decryptedProfile,
      meta: this.calculateCompleteness(profile)
    };
  }

  async upsertProfile(userId: string, data: Partial<AdopterProfile>) {
    const preparedData = { ...data };

    // Encrypt PII fields
    this.ENCRYPTED_FIELDS.forEach(field => {
      if (typeof preparedData[field] === 'string') {
        (preparedData as any)[field] = encrypt(preparedData[field] as string);
      }
    });

    const profile = await prisma.adopterProfile.upsert({
      where: { user_id: userId },
      update: preparedData,
      create: {
        user_id: userId,
        full_name: preparedData.full_name || '', // Default or from data
        ...(preparedData as any)
      },
      include: { home_photos: true }
    });

    // Recalculate status and meta
    const meta = this.calculateCompleteness(profile);

    // Update status if it changed from complete to incomplete or vice versa
    const newStatus = meta.is_complete ? 'COMPLETED' : 'DRAFT';
    if (profile.status !== newStatus) {
      return prisma.adopterProfile.update({
        where: { user_id: userId },
        data: { status: newStatus },
        include: { home_photos: true }
      });
    }

    return profile;
  }

  private calculateCompleteness(profile: any) {
    const totalMandatory = this.MANDATORY_FIELDS.length + 1; // +1 for photos
    let completedCount = 0;
    const missingFields: string[] = [];

    this.MANDATORY_FIELDS.forEach(field => {
      const val = profile[field];
      if (val !== null && val !== undefined && val !== '') {
        completedCount++;
      } else {
        missingFields.push(String(field));
      }
    });

    // Photo check (Requirement: min 2 photos)
    const photoCount = profile.home_photos?.length || 0;
    if (photoCount >= 2) {
      completedCount++;
    } else {
      missingFields.push('home_photos (min 2)');
    }

    const percentage = Math.round((completedCount / totalMandatory) * 100);

    return {
      completion_percentage: percentage,
      is_complete: percentage === 100,
      missing_fields: missingFields
    };
  }

  async addHomePhoto(userId: string, photoUrl: string, description?: string) {
    const photo = await prisma.adopterHomePhoto.create({
      data: {
        adopter_id: userId,
        photo_url: photoUrl,
        description
      }
    });

    // Recalculate status
    await this.updateProfileStatus(userId);

    return photo;
  }

  async deleteHomePhoto(userId: string, photoId: string) {
    const photo = await prisma.adopterHomePhoto.findUnique({
      where: { id: photoId }
    });

    if (!photo || photo.adopter_id !== userId) {
      throw new Error('Photo not found or unauthorized');
    }

    await prisma.adopterHomePhoto.delete({
      where: { id: photoId }
    });

    // Recalculate status
    await this.updateProfileStatus(userId);
  }

  private async updateProfileStatus(userId: string) {
    const profile = await prisma.adopterProfile.findUnique({
      where: { user_id: userId },
      include: { home_photos: true }
    });

    if (!profile) return;

    const meta = this.calculateCompleteness(profile);
    const newStatus = meta.is_complete ? 'COMPLETED' : 'DRAFT';

    if (profile.status !== newStatus) {
      await prisma.adopterProfile.update({
        where: { user_id: userId },
        data: { status: newStatus }
      });
    }
  }
}
