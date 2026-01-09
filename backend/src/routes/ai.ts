import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { chatWithAI } from '../services/ai';
import db from '../db/schema';

const router = Router();

// Chat with AI coach
router.post('/chat', authMiddleware, async (req: AuthRequest, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    const reply = await chatWithAI(req.userId!, message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'AI service error' });
  }
});

// Get chat history
router.get('/history', authMiddleware, (req: AuthRequest, res) => {
  const history = db.prepare(`
    SELECT role, content, created_at
    FROM ai_chats
    WHERE user_id = ?
    ORDER BY created_at ASC
  `).all(req.userId);

  res.json(history);
});

export default router;
