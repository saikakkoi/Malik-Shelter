import cron from 'node-cron';
import { VisitSlotService } from './services/visit-slot.service';

const visitSlotService = new VisitSlotService();

export const initCronJobs = () => {
  console.log('[Cron] Initializing background tasks...');

  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily visit slot generation...');
    try {
      await visitSlotService.generateDailySlots(7);
      console.log('[Cron] Daily visit slot generation completed.');
    } catch (error) {
      console.error('[Cron] Error during daily visit slot generation:', error);
    }
  });

  console.log('[Cron] All jobs scheduled.');
};
