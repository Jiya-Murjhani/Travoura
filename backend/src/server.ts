import express from 'express';
import cors from 'cors';
import { testConnection } from './db';
import { authenticateToken } from './middleware/authMiddleware';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Travoura API is running' });
});

app.get('/test-db', async (_req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ success: true, message: 'PostgreSQL connection successful' });
    } else {
      res.status(500).json({ success: false, message: 'PostgreSQL connection failed' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You accessed protected route' });
});

// API routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
