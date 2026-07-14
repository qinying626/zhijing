import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { FriendModel } from '../models/Friend';

const router = Router();

router.post('/add', async (req: Request, res: Response) => {
  const { userId, friendId, friendName } = req.body;
  if (!userId || !friendId) return res.status(400).json(errorRes(400, '缺少必填字段'));
  const existing = await FriendModel.findOne({ userId, friendId });
  if (existing) return res.status(409).json(errorRes(409, '已是好友或已发送请求'));
  const friend = await FriendModel.create({ userId, friendId, friendName });
  res.status(201).json(successRes(friend, '好友请求已发送'));
});

router.get('/list/:userId', async (req: Request, res: Response) => {
  const friends = await FriendModel.find({ userId: req.params.userId, status: 'accepted' });
  res.json(successRes(friends));
});

router.delete('/:id', async (req: Request, res: Response) => {
  await FriendModel.findByIdAndDelete(req.params.id);
  res.json(successRes(null, '已删除好友'));
});

export default router;
