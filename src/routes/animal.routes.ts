import { Router, Request, Response } from 'express';
import * as animalController from '../controllers/animal.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../services/image.service';

const router: Router = Router();

// Public routes
router.get('/', animalController.listAnimals);
router.get('/:id', animalController.getAnimal);

// Protected routes
router.post('/', authMiddleware, upload.array('photos', 5), animalController.createAnimal);
router.put('/:id', authMiddleware, upload.array('photos', 5), animalController.updateAnimal);
router.delete('/:id', authMiddleware, animalController.archiveAnimal);

export default router;
