const { signToken, verifyToken } = require('../../src/utils/token');
const bcrypt = require('bcryptjs');

describe('Unit Tests: Authentication & Security Utilities', () => {
  test('Token signing and verification returns valid payload', () => {
    const payload = { userId: 42, email: 'test@lingualearn.com', role: 'learner' };
    const token = signToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(42);
    expect(decoded.email).toBe('test@lingualearn.com');
    expect(decoded.role).toBe('learner');
  });

  test('Bcrypt generates secure hash and verifies password correctly', async () => {
    const raw = 'SecurePassword2026!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(raw, salt);

    expect(hash).not.toBe(raw);
    const isMatch = await bcrypt.compare(raw, hash);
    expect(isMatch).toBe(true);

    const isWrong = await bcrypt.compare('WrongPassword', hash);
    expect(isWrong).toBe(false);
  });
});
