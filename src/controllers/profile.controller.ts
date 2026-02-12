import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProfileService } from '../services/profile.service';

const profileService = new ProfileService();

export class ProfileController {
  async getMyProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const profile = await profileService.getProfile(req.user.userId);
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Profile not found' });
      }

      return res.status(200).json({
        success: true,
        data: profile,
        meta: profile.meta
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async updateMyProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const updatedProfile = await profileService.upsertProfile(req.user.userId, req.body);

      // Return refreshed profile with decrypted data and meta
      const fullProfile = await profileService.getProfile(req.user.userId);

      return res.status(200).json({
        success: true,
        data: fullProfile,
        meta: fullProfile?.meta
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async uploadHomePhoto(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No photo provided' });
      }

      const { ImageService } = require('../services/image.service');
      const photoUrl = ImageService.getImageUrl(req.file.filename);
      const description = typeof req.body.description === 'string' ? req.body.description : undefined;

      const photo = await profileService.addHomePhoto(req.user.userId, photoUrl, description);

      return res.status(201).json({
        success: true,
        data: photo
      });
    } catch (error) {
      console.error('Error uploading home photo:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async deleteHomePhoto(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { photoId } = req.params;
      await profileService.deleteHomePhoto(req.user.userId, photoId as string);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Photo not found or unauthorized') {
        return res.status(404).json({ success: false, error: error.message });
      }
      console.error('Error deleting home photo:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getAdopterProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user || (req.user.role !== 'STAFF' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
      }

      const { id } = req.params;
      const profile = await profileService.getProfile(id as string);

      if (!profile) {
        return res.status(404).json({ success: false, error: 'Adopter profile not found' });
      }

      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error reviewing adopter profile:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
