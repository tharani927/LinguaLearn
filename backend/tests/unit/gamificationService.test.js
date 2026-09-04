const gamificationService = require('../../src/services/gamificationService');
const db = require('../../src/config/db');

describe('Unit Tests: Gamification & Habits', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  test('Initializes streak and updates consecutively', async () => {
    const result = await gamificationService.updateStreak(2);
    expect(result).toHaveProperty('currentStreak');
    expect(result).toHaveProperty('longestStreak');
    expect(typeof result.currentStreak).toBe('number');
  });

  test('Fetches and initializes daily mission', async () => {
    const mission = await gamificationService.getDailyMission(2);
    expect(mission).toHaveProperty('lesson_completed');
    expect(mission).toHaveProperty('vocab_practiced');
    expect(mission).toHaveProperty('assessment_completed');
  });
});
