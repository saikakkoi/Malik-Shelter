import { Router } from 'express';
import { VisitSlotController } from '../controllers/visit-slot.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();
const controller = new VisitSlotController();

// Public/Adopter
router.get('/available', controller.getAvailableSlots);

// Staff only (Settings/Templates)
router.get('/templates', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.listTemplates);
router.post('/templates', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.createTemplate);
router.delete('/templates/:id', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.deleteTemplate);
router.post('/generate', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.generateSlots);

export default router;
