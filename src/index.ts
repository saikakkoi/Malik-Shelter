import app from './app';
import { initCronJobs } from './cron';

const PORT = process.env.PORT || 3000;

initCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
