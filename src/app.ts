import express from 'express';
import cors from 'cors';
import path from 'path';

import animalRoutes from './routes/animal.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import staffRoutes from './routes/staff.routes';
import adoptionRequestRoutes from './routes/adoption-request.routes';
import visitSlotRoutes from './routes/visit-slot.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/animals', animalRoutes);
app.use('/me/profile', profileRoutes);
app.use('/adopters', staffRoutes);
app.use('/adoption-requests', adoptionRequestRoutes);
app.use('/visit-slots', visitSlotRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
