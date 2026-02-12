import { Router } from 'express';
import { AdoptionRequestController } from '../controllers/adoption-request.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();
const controller = new AdoptionRequestController();

// Adopter only
router.post('/', authMiddleware, roleMiddleware(['ADOPTER']), controller.createRequest);
router.get('/my', authMiddleware, roleMiddleware(['ADOPTER']), controller.getMyRequests);
router.post('/:id/cancel', authMiddleware, roleMiddleware(['ADOPTER']), controller.cancel);

// Staff only
router.get('/', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.listRequests);
router.patch('/:id/status', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.updateStatus);
router.patch('/bookings/:id/status', authMiddleware, roleMiddleware(['STAFF', 'ADMIN']), controller.checkIn);

export default router;
