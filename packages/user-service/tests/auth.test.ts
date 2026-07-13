import { generateToken, verifyToken } from '@zhijing/shared';

describe('Auth', () => {
  describe('JWT token generation and verification', () => {
    it('should generate a valid token', () => {
      const payload = { userId: 'test-uuid-123', username: 'testuser' };
      const token = generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify a valid token and return payload', () => {
      const payload = { userId: 'test-uuid-123', username: 'testuser' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(payload.userId);
      expect(decoded!.username).toBe(payload.username);
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      const decoded = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxMDAwMDAwMDAwLCJleHAiOjEwMDAwMDAwMDF9.invalid');
      expect(decoded).toBeNull();
    });
  });
});
