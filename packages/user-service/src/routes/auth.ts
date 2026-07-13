import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, successRes, errorRes } from '@zhijing/shared';
import { UserModel } from '../models/User';
import { CharacterModel } from '../models/Character';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, characterName, subjectPreference } = req.body;
  if (!username || !email || !password || !characterName) {
    return res.status(400).json(errorRes(400, '缺少必填字段'));
  }
  const User = req.app.locals.User as typeof UserModel;
  const Character = req.app.locals.Character as typeof CharacterModel;

  const existing = await User.findOne({ where: { $or: [{ username }, { email }] } });
  if (existing) {
    return res.status(409).json(errorRes(409, '用户名或邮箱已存在'));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });
  await Character.create({
    userId: user.id,
    name: characterName,
    subjectPreference: subjectPreference || 'math',
  });

  const token = generateToken({ userId: user.id, username: user.username });
  res.status(201).json(successRes({ token, userId: user.id }, '注册成功'));
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json(errorRes(400, '缺少用户名或密码'));
  }
  const User = req.app.locals.User as typeof UserModel;

  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json(errorRes(401, '用户名或密码错误'));
  }

  const token = generateToken({ userId: user.id, username: user.username });
  res.json(successRes({ token, userId: user.id }, '登录成功'));
});

router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json(errorRes(401, '未登录'));
  }
  const { verifyToken } = await import('@zhijing/shared');
  const payload = verifyToken(authHeader.slice(7));
  if (!payload) {
    return res.status(401).json(errorRes(401, 'Token 无效'));
  }
  const User = req.app.locals.User as typeof UserModel;
  const user = await User.findByPk(payload.userId, { attributes: ['id', 'username', 'email'] });
  if (!user) {
    return res.status(404).json(errorRes(404, '用户不存在'));
  }
  res.json(successRes(user));
});

export default router;
