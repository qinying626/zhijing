import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { KnowledgeCardModel } from '../models/KnowledgeCard';

const router = Router();

router.get('/:subject', async (req: Request, res: Response) => {
  const cards = await KnowledgeCardModel.find({ subject: req.params.subject });
  res.json(successRes(cards));
});

router.get('/card/:id', async (req: Request, res: Response) => {
  const card = await KnowledgeCardModel.findById(req.params.id);
  if (!card) return res.status(404).json(errorRes(404, '知识卡片不存在'));
  res.json(successRes(card));
});

export default router;
