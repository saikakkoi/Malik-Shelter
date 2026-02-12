import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../services/image.service';

const router = Router();
const profileController = new ProfileController();

// All /me routes require authentication
router.get('/', authMiddleware, profileController.getMyProfile);
router.patch('/', authMiddleware, profileController.updateMyProfile);

// Photo management
router.post('/photos', authMiddleware, upload.single('photo'), profileController.uploadHomePhoto);
router.delete('/photos/:photoId', authMiddleware, profileController.deleteHomePhoto);

export default router;
