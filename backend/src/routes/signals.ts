import { Router } from 'express';
import db from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get today's signals (max 3)
router.get('/', authMiddleware, (req, res) => {
  const signals = db.prepare(`
    SELECT * FROM signals
    ORDER BY created_at DESC
    LIMIT 3
  `).all();

  res.json(signals);
});

// Get signal by ID
router.get('/:id', authMiddleware, (req, res) => {
  const signal = db.prepare('SELECT * FROM signals WHERE id = ?').get(req.params.id);

  if (!signal) {
    return res.status(404).json({ error: 'Signal not found' });
  }

  res.json(signal);
});

export default router;
