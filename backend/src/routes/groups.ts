import { Router } from 'express';
import db from '../db/schema';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all groups
router.get('/', authMiddleware, (req, res) => {
  const groups = db.prepare(`
    SELECT g.*, COUNT(gm.id) as member_count
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    GROUP BY g.id
    ORDER BY g.created_at DESC
  `).all();

  res.json(groups);
});

// Join group
router.post('/:id/join', authMiddleware, (req: AuthRequest, res) => {
  try {
    db.prepare(`
      INSERT INTO group_members (group_id, user_id) VALUES (?, ?)
    `).run(req.params.id, req.userId);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: 'Already a member' });
  }
});

// Get group messages
router.get('/:id/messages', authMiddleware, (req, res) => {
  const messages = db.prepare(`
    SELECT gm.*, u.name as user_name
    FROM group_messages gm
    JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = ?
    ORDER BY gm.created_at DESC
    LIMIT 50
  `).all(req.params.id);

  res.json(messages);
});

// Send message
router.post('/:id/messages', authMiddleware, (req: AuthRequest, res) => {
  const { content, isCheckin } = req.body;

  const result = db.prepare(`
    INSERT INTO group_messages (group_id, user_id, content, is_checkin)
    VALUES (?, ?, ?, ?)
  `).run(req.params.id, req.userId, content, isCheckin ? 1 : 0);

  res.json({ id: result.lastInsertRowid });
});

export default router;
