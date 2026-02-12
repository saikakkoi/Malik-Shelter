import { Request, Response } from 'express';
import { VisitSlotService } from '../services/visit-slot.service';

const visitSlotService = new VisitSlotService();

export class VisitSlotController {
  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      const slots = await visitSlotService.getAvailableSlots(date as string);
      res.json(slots);
    } catch (error) {
      console.error('[VisitSlotController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async listTemplates(req: Request, res: Response) {
    try {
      const templates = await visitSlotService.listTemplates();
      res.json(templates);
    } catch (error) {
      console.error('[VisitSlotController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTemplate(req: Request, res: Response) {
    try {
      const staffId = (req as any).user.userId;
      const template = await visitSlotService.createTemplate({
        ...req.body,
        created_by_id: staffId
      });
      res.status(201).json(template);
    } catch (error) {
      console.error('[VisitSlotController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await visitSlotService.deleteTemplate(id as string);
      res.status(204).send();
    } catch (error) {
      console.error('[VisitSlotController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async generateSlots(req: Request, res: Response) {
    try {
      const { days } = req.body;
      const result = await visitSlotService.generateDailySlots(days || 7);
      res.json(result);
    } catch (error) {
      console.error('[VisitSlotController] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
