import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zhijing-dev-secret';
const JWT_EXPIRES = '7d';

export function generateToken(payload: { userId: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch {
    return null;
  }
}
