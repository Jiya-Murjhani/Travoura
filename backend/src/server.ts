import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';
import { authenticateToken } from './middleware/authMiddleware';
import tripRoutes from './routes/tripRoutes';
import itineraryRoutes from './routes/itinerary';
import expenseRoutes from './routes/expenses';
import preferencesRoutes from './routes/preferencesRoutes';
import exploreRoutes from './routes/explore';
import bookingRoutes from './routes/bookings';
import parseTripIntentRoutes from './routes/parseTripIntent';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://travoura-six.vercel.app', // your Vercel URL (update after deploy)
    process.env.FRONTEND_URL || ''
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Travoura API is running' });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You accessed protected route', user: (req as any).user });
});

// API routes
app.use('/api/trips/:tripId/expenses', expenseRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/parse-trip-intent', parseTripIntentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
