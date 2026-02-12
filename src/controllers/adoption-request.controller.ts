import { Request, Response } from 'express';
import { AdoptionRequestService } from '../services/adoption-request.service';

const adoptionRequestService = new AdoptionRequestService();

export class AdoptionRequestController {
  async createRequest(req: Request, res: Response) {
    try {
      const { animal_id, slot_id, date } = req.body;
      const adopterId = (req as any).user.userId;

      const request = await adoptionRequestService.createRequest(
        adopterId,
        animal_id,
        slot_id,
        date
      );

      res.status(201).json(request);
    } catch (error: any) {
      if (error.message === 'PROFILE_INCOMPLETE') {
        return res.status(403).json({ error: 'Your profile must be completed before requesting a visit.' });
      }
      if (error.message === 'ANIMAL_NOT_AVAILABLE') {
        return res.status(400).json({ error: 'This animal is no longer available for adoption.' });
      }
      if (error.message === 'SLOT_FULL') {
        return res.status(400).json({ error: 'This visit slot is already full.' });
      }
      if (error.message === 'CONCURRENCY_ERROR') {
        return res.status(409).json({ error: 'The slot was booked by someone else. Please try again.' });
      }

      console.error('[AdoptionRequestController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyRequests(req: Request, res: Response) {
    try {
      const adopterId = (req as any).user.userId;
      const requests = await adoptionRequestService.getMyRequests(adopterId);
      res.json(requests);
    } catch (error) {
      console.error('[AdoptionRequestController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async listRequests(req: Request, res: Response) {
    try {
      const { status, species, adopter_name, page, limit } = req.query;

      const filters = {
        status: status as string,
        species: species as string,
        adopter_name: adopter_name as string
      };

      const pagination = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20
      };

      const result = await adoptionRequestService.listRequests(filters, pagination);
      res.json(result);
    } catch (error) {
      console.error('[AdoptionRequestController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const request = await adoptionRequestService.updateRequestStatus(id as string, status as string, notes as string);
      res.json(request);
    } catch (error: any) {
      if (error.message === 'NOTES_REQUIRED_FOR_APPROVAL') {
        return res.status(400).json({ error: 'Visit notes are mandatory before approving an adoption.' });
      }
      console.error('[AdoptionRequestController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const request = await adoptionRequestService.cancelRequest(id as string, userId);
      res.json(request);
    } catch (error: any) {
      if (error.message === 'REQUEST_NOT_FOUND') {
        return res.status(404).json({ error: 'Request not found.' });
      }
      if (error.message === 'CANCELLATION_WINDOW_EXPIRED') {
        return res.status(400).json({ error: 'Visits cannot be cancelled within 2 hours of the scheduled time.' });
      }
      console.error('[AdoptionRequestController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const { id } = req.params; // booking id
      const { status } = req.body;

      const booking = await adoptionRequestService.updateBookingStatus(id as string, status as string);
      res.json(booking);
    } catch (error) {
      console.error('[AdoptionRequestController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
