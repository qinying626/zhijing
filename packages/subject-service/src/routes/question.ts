import { Router, Request, Response } from 'express';
import { successRes } from '@zhijing/shared';
import { QuestionModel } from '../models/Question';
import { KnowledgePointModel } from '../models/KnowledgePoint';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { subject, knowledgePointId, difficulty, limit = '10' } = req.query;
  const filter: Record<string, unknown> = {};
  if (subject) filter.subject = subject;
  if (knowledgePointId) filter.knowledgePointId = knowledgePointId;
  if (difficulty) filter.difficulty = difficulty;
  const questions = await QuestionModel.find(filter).limit(Number(limit));
  res.json(successRes(questions));
});

router.get('/knowledge-points/:subject', async (req: Request, res: Response) => {
  const points = await KnowledgePointModel.find({ subject: req.params.subject }).sort({ order: 1 });
  res.json(successRes(points));
});

export default router;
