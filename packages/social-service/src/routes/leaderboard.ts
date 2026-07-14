import { Router, Request, Response } from 'express';
import { successRes } from '@zhijing/shared';
import { getLeaderboard } from '../models/Leaderboard';

const router = Router();

router.get('/:type', async (req: Request, res: Response) => {
  const { type } = req.params;
  const leaderboard = await getLeaderboard(type);
  res.json(successRes(leaderboard));
});

export default router;
