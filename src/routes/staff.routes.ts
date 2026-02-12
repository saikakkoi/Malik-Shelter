import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

// Staff review of adopter profiles
router.get('/:id', authMiddleware, profileController.getAdopterProfile);

export default router;
