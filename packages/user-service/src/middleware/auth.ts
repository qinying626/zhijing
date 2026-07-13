import { Request, Response, NextFunction } from 'express';
import { verifyToken, errorRes } from '@zhijing/shared';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json(errorRes(401, '未登录'));
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json(errorRes(401, 'Token 无效'));
  }
  req.user = payload;
  next();
}

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; username: string };
    }
  }
}
