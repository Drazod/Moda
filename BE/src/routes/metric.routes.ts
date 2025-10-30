// src/routes/metrics.route.ts
import { Router } from 'express';
import { optionalAuth } from '../middlewares/optionalAuth';
import { recordHeartbeat, getPresenceCounts } from '../services/presence.services';
import authMiddleware from '../middlewares/authentication';
import authorize from '../middlewares/authorization';
import router from './vnpay.routes';

const metricRoute: Router = Router();

// Clients ping every ~20–30s to say “I’m online”
metricRoute.post('/heartbeat', optionalAuth, async (req, res) => {
  const userId = (req as any).user?.id as number | undefined;
  const guestId = typeof req.body?.guestId === 'string' ? req.body.guestId : undefined;
  if (!userId && !guestId) return res.status(400).json({ message: 'guestId required for guests' });

  await recordHeartbeat({ userId, guestId });
  res.json({ ok: true });
});

// Admin can read current presence snapshot
metricRoute.get('/summary',
  authMiddleware,
  authorize(["ADMIN", "HOST"]),
  async (_req, res) => {
    const counts = await getPresenceCounts();
    res.json(counts);
  }
);

export default metricRoute;
