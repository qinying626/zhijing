import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { KnowledgeCardModel } from '../models/KnowledgeCard';
import { ExamPaperModel } from '../models/ExamPaper';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { knowledgePoints, questions, examPapers } = req.body;
  const results = { knowledgeCards: 0, examPapers: 0 };

  if (knowledgePoints?.length) {
    const docs = knowledgePoints.map((kp: { knowledgePointId: string; title: string; summary: string; details: string; examples: string[]; subject: string }) => ({
      ...kp,
      knowledgePointId: kp.knowledgePointId || kp.title,
    }));
    const inserted = await KnowledgeCardModel.insertMany(docs);
    results.knowledgeCards = inserted.length;
  }

  if (examPapers?.length) {
    const inserted = await ExamPaperModel.insertMany(examPapers);
    results.examPapers = inserted.length;
  }

  res.status(201).json(successRes(results, '导入完成'));
});

export default router;
