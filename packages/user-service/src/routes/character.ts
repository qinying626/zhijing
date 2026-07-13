import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { authMiddleware } from '../middleware/auth';
import { CharacterModel } from '../models/Character';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { name, subjectPreference } = req.body;
  if (!name) return res.status(400).json(errorRes(400, '角色名不能为空'));
  const Character = req.app.locals.Character as typeof CharacterModel;
  const character = await Character.create({
    userId: req.user!.userId,
    name,
    subjectPreference: subjectPreference || 'math',
  });
  res.status(201).json(successRes(character, '角色创建成功'));
});

router.get('/mine', authMiddleware, async (req: Request, res: Response) => {
  const Character = req.app.locals.Character as typeof CharacterModel;
  const characters = await Character.findAll({ where: { userId: req.user!.userId } });
  res.json(successRes(characters));
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  const Character = req.app.locals.Character as typeof CharacterModel;
  const character = await Character.findOne({ where: { id: req.params.id, userId: req.user!.userId } });
  if (!character) return res.status(404).json(errorRes(404, '角色不存在'));
  await character.update(req.body);
  res.json(successRes(character));
});

export default router;
