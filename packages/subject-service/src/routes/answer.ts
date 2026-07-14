import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { QuestionModel } from '../models/Question';
import { AnswerRecordModel } from '../models/AnswerRecord';

const EXPERIENCE_MAP = { basic: 10, advanced: 25, challenge: 50 };

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { questionId, userAnswer, userId, stepAnswers } = req.body;
  if (!questionId || !userAnswer || !userId) {
    return res.status(400).json(errorRes(400, '缺少必填字段'));
  }

  const question = await QuestionModel.findById(questionId);
  if (!question) return res.status(404).json(errorRes(404, '题目不存在'));

  let correct = false;
  let experienceGained = 0;
  let stepResults: { order: number; correct: boolean; answer: string }[] = [];

  if (question.steps?.length && stepAnswers?.length) {
    for (const step of question.steps) {
      const userStep = stepAnswers.find((s: { order: number }) => s.order === step.order);
      const stepAnswer = step.answer ?? '';
      const stepCorrect = userStep?.answer?.trim() === stepAnswer.trim();
      stepResults.push({ order: step.order ?? 0, correct: stepCorrect, answer: stepAnswer });
    }
    correct = stepResults.every(s => s.correct);
  } else {
    if (Array.isArray(question.answer)) {
      correct = Array.isArray(userAnswer) && question.answer.every((a: string, i: number) => a === userAnswer[i]);
    } else {
      correct = userAnswer.trim() === String(question.answer).trim();
    }
  }

  if (correct) {
    experienceGained = EXPERIENCE_MAP[question.difficulty as keyof typeof EXPERIENCE_MAP] || 10;
  }

  await AnswerRecordModel.create({
    userId,
    questionId,
    correct,
    userAnswer,
    stepResults,
  });

  res.json(successRes({ correct, experienceGained, stepResults }, correct ? '回答正确' : '回答错误'));
});

export default router;
