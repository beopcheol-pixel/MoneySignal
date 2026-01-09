import { Router } from 'express';
import db from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all channels
router.get('/', authMiddleware, (req, res) => {
  const channels = db.prepare('SELECT * FROM channels ORDER BY created_at DESC').all();
  res.json(channels);
});

// Get channel posts
router.get('/:id/posts', authMiddleware, (req, res) => {
  const posts = db.prepare(`
    SELECT * FROM channel_posts
    WHERE channel_id = ?
    ORDER BY created_at DESC
  `).all(req.params.id);

  res.json(posts);
});

export default router;
