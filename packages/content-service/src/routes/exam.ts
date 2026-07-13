import { Router, Request, Response } from 'express';
import { successRes } from '@zhijing/shared';
import { ExamPaperModel } from '../models/ExamPaper';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { year, province, subject } = req.query;
  const filter: Record<string, unknown> = {};
  if (year) filter.year = Number(year);
  if (province) filter.province = province;
  if (subject) filter.subject = subject;
  const papers = await ExamPaperModel.find(filter);
  res.json(successRes(papers));
});

export default router;
