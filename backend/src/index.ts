import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import signalsRoutes from './routes/signals';
import channelsRoutes from './routes/channels';
import groupsRoutes from './routes/groups';
import aiRoutes from './routes/ai';
import profileRoutes from './routes/profile';

// Seed database
import './db/seed';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/signals', signalsRoutes);
app.use('/api/channels', channelsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 MoneySignal API running on http://localhost:${PORT}`);
});
