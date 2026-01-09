import { Router } from 'express';
import db from '../db/schema';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const user = db.prepare(`
    SELECT id, email, name, is_subscribed, created_at FROM users WHERE id = ?
  `).get(req.userId) as any;

  const financialProfile = db.prepare(`
    SELECT * FROM financial_profiles WHERE user_id = ?
  `).get(req.userId);

  res.json({ ...user, financialProfile });
});

// Update financial profile
router.put('/financial', authMiddleware, (req: AuthRequest, res) => {
  const { incomeRange, investmentStyle, riskTolerance, goals } = req.body;

  // Upsert financial profile
  db.prepare(`
    INSERT INTO financial_profiles (user_id, income_range, investment_style, risk_tolerance, goals)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      income_range = excluded.income_range,
      investment_style = excluded.investment_style,
      risk_tolerance = excluded.risk_tolerance,
      goals = excluded.goals
  `).run(req.userId, incomeRange, investmentStyle, riskTolerance, goals);

  res.json({ success: true });
});

// Mock subscription toggle (no real payment)
router.post('/subscribe', authMiddleware, (req: AuthRequest, res) => {
  db.prepare('UPDATE users SET is_subscribed = 1 WHERE id = ?').run(req.userId);
  res.json({ success: true, isSubscribed: true });
});

export default router;
