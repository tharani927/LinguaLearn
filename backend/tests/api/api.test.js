const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/db');

describe('Full Integration API Tests Suite', () => {
  let learnerToken = '';
  let adminToken = '';
  const testEmail = `test_learner_${Date.now()}@lingualearn.com`;

  afterAll(async () => {
    // Clean up test created user
    await db.query('DELETE FROM users WHERE email = $1', [testEmail]);
    await db.pool.end();
  });

  // 1. System Health
  test('GET /api/health returns healthy system status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.services.database.status).toBe('UP');
  });

  // 2. Auth: Registration
  test('POST /api/auth/register registers new learner account', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'Password123!',
        full_name: 'Test Automation Learner',
        target_language: 'Spanish',
        proficiency_level: 'Beginner',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(testEmail);
    learnerToken = res.body.data.token;
  });

  // 3. Auth: Login
  test('POST /api/auth/login logs in seeded learner', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'learner@lingualearn.com',
        password: 'LearnerPass123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    learnerToken = res.body.data.token;
  });

  test('POST /api/auth/login logs in seeded admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@lingualearn.com',
        password: 'AdminPass123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('admin');
    adminToken = res.body.data.token;
  });

  // 4. Authenticated Profile
  test('GET /api/users/profile fetches authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('target_language');
    expect(res.body.data).toHaveProperty('theme');
  });

  // 5. Theme persistence
  test('PUT /api/users/theme updates theme preference in PostgreSQL', async () => {
    const res = await request(app)
      .put('/api/users/theme')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ theme: 'midnight', appearance: 'dark' });

    expect(res.status).toBe(200);
    expect(res.body.data.theme).toBe('midnight');
  });

  // 6. Courses & Curriculum
  test('GET /api/courses lists published courses with filters', async () => {
    const res = await request(app).get('/api/courses?language=Spanish');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/courses/1 retrieves course details with lesson list', async () => {
    const res = await request(app)
      .get('/api/courses/1')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('lessons');
    expect(res.body.data.lessons.length).toBeGreaterThan(0);
  });

  test('POST /api/courses/1/enroll enrolls learner into course', async () => {
    const res = await request(app)
      .post('/api/courses/1/enroll')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect([200, 201]).toContain(res.status);
    expect(res.body.data.course_id).toBe(1);
  });

  // 7. Lessons & Vocabulary
  test('GET /api/lessons/1 retrieves lesson content with vocabulary', async () => {
    const res = await request(app)
      .get('/api/lessons/1')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('content');
    expect(res.body.data).toHaveProperty('vocabulary');
  });

  test('POST /api/lessons/1/complete records lesson completion and awards points', async () => {
    const res = await request(app)
      .post('/api/lessons/1/complete')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pointsAwarded).toBe(20);
  });

  // 8. Assessments & AI Grading
  test('GET /api/assessments/1 retrieves assessment questions without answers', async () => {
    const res = await request(app)
      .get('/api/assessments/1')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.questions.length).toBeGreaterThan(0);
    expect(res.body.data.questions[0]).not.toHaveProperty('correct_answer');
  });

  test('POST /api/assessments/1/submit grades answers and invokes AI feedback engine', async () => {
    const res = await request(app)
      .post('/api/assessments/1/submit')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        answers: [
          { question_id: 1, user_answer: 'Buenos días' }, // correct
          { question_id: 2, user_answer: 'False' },       // correct
          { question_id: 3, user_answer: 'gracias' },     // correct
        ],
        time_spent_seconds: 120,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.score).toBe(100);
    expect(res.body.data.passed).toBe(true);
    expect(res.body.data.feedback).toBeDefined();
    expect(res.body.data.feedback.overall_summary).toBeDefined();
  });

  // 9. Adaptive Mistake Vault & Skills
  test('GET /api/adaptive/skills retrieves 5-dimension skill profile', async () => {
    const res = await request(app)
      .get('/api/adaptive/skills')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  test('GET /api/adaptive/mistakes fetches learner mistake vault items', async () => {
    const res = await request(app)
      .get('/api/adaptive/mistakes')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 10. AI Assistant Chat
  test('POST /api/ai/chat asks question to language tutor', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ message: 'What is the difference between Ser and Estar?' });

    expect(res.status).toBe(200);
    expect(res.body.data.reply).toContain('SER');
    expect(res.body.data.reply).toContain('ESTAR');
  });

  // 11. Gamification: Missions & Streaks
  test('GET /api/gamification/daily-mission returns daily checklist', async () => {
    const res = await request(app)
      .get('/api/gamification/daily-mission')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('lesson_completed');
  });

  // 12. Admin Dashboard & Analytics
  test('GET /api/admin/dashboard returns real metrics for admin', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalUsers');
    expect(res.body.data).toHaveProperty('totalCourses');
  });

  test('GET /api/analytics/difficult-topics identifies challenging topics', async () => {
    const res = await request(app)
      .get('/api/analytics/difficult-topics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('mostDifficultTopic');
  });

  test('GET /api/analytics/at-risk-learners identifies struggling learners', async () => {
    const res = await request(app)
      .get('/api/analytics/at-risk-learners')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('atRiskCount');
  });

  // 13. Reports CSV Export
  test('GET /api/reports/progress?format=csv returns CSV file', async () => {
    const res = await request(app)
      .get('/api/reports/progress?format=csv')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
    expect(res.text).toContain('user_id,full_name,email');
  });
});
