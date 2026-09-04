const db = require('../config/db');

const getDashboardStats = async () => {
  const usersCount = await db.query('SELECT COUNT(*)::int AS count FROM users WHERE role_id = 2');
  const activeLearners = await db.query(
    `SELECT COUNT(DISTINCT user_id)::int AS count 
     FROM activity_logs 
     WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'`
  );
  const coursesCount = await db.query('SELECT COUNT(*)::int AS count FROM courses');
  const assessmentsCount = await db.query('SELECT COUNT(*)::int AS count FROM assessment_results');
  const avgScoreRes = await db.query('SELECT COALESCE(AVG(score), 0)::numeric(5,2) AS avg_score FROM assessment_results');
  const completionRateRes = await db.query(
    `SELECT 
       COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / 
       NULLIF(COUNT(*)::float, 0) * 100 AS rate
     FROM course_enrollments`
  );

  const recentActivityRes = await db.query(
    `SELECT al.id, al.action, al.entity_type, al.entity_id, al.created_at, u.full_name, u.email
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC
     LIMIT 10`
  );

  return {
    totalUsers: usersCount.rows[0].count,
    activeLearners: activeLearners.rows[0].count || 1,
    totalCourses: coursesCount.rows[0].count,
    completedAssessments: assessmentsCount.rows[0].count,
    averageScore: parseFloat(avgScoreRes.rows[0].avg_score) || 0,
    completionRate: Math.round(completionRateRes.rows[0].rate || 0),
    recentActivity: recentActivityRes.rows,
  };
};

const getUsers = async ({ search, role, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  let query = `
    SELECT u.id, u.email, u.full_name, u.is_active, u.created_at, r.name AS role,
           p.target_language, p.proficiency_level,
           (SELECT COUNT(*)::int FROM course_enrollments WHERE user_id = u.id) AS enrolled_courses,
           (SELECT COUNT(*)::int FROM assessment_results WHERE user_id = u.id) AS assessments_taken,
           (SELECT COALESCE(AVG(score), 0)::numeric(5,2) FROM assessment_results WHERE user_id = u.id) AS avg_score,
           COALESCE(ls.current_streak, 0) AS streak
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN user_profiles p ON u.id = p.user_id
    LEFT JOIN learning_streaks ls ON u.id = ls.user_id
    WHERE 1=1
  `;
  const params = [];
  let paramIdx = 1;

  if (search) {
    query += ` AND (LOWER(u.email) LIKE $${paramIdx} OR LOWER(u.full_name) LIKE $${paramIdx})`;
    params.push(`%${search.toLowerCase()}%`);
    paramIdx++;
  }

  if (role) {
    query += ` AND r.name = $${paramIdx}`;
    params.push(role);
    paramIdx++;
  }

  query += ` ORDER BY u.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
  params.push(limit, offset);

  const res = await db.query(query, params);

  // Total count for pagination
  const countRes = await db.query('SELECT COUNT(*)::int AS count FROM users');

  return {
    users: res.rows,
    total: countRes.rows[0].count,
    page: parseInt(page, 10),
    totalPages: Math.ceil(countRes.rows[0].count / limit),
  };
};

const getUserDetails = async (userId) => {
  const userRes = await db.query(
    `SELECT u.id, u.email, u.full_name, u.is_active, u.created_at, r.name AS role,
            p.target_language, p.proficiency_level, p.daily_goal_minutes, p.theme, p.appearance, p.bio
     FROM users u
     JOIN roles r ON u.role_id = r.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (userRes.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const user = userRes.rows[0];

  // Fetch skill profile
  const skillsRes = await db.query('SELECT * FROM skill_profiles WHERE user_id = $1', [userId]);
  user.skills = skillsRes.rows;

  // Fetch assessment history
  const assessRes = await db.query(
    `SELECT ar.*, a.title AS assessment_title
     FROM assessment_results ar
     JOIN assessments a ON ar.assessment_id = a.id
     WHERE ar.user_id = $1
     ORDER BY ar.completed_at DESC`,
    [userId]
  );
  user.assessments = assessRes.rows;

  // Fetch mistake vault
  const mistakesRes = await db.query(
    `SELECT mv.*, q.prompt, q.correct_answer, q.skill_category
     FROM mistake_vault mv
     JOIN questions q ON mv.question_id = q.id
     WHERE mv.user_id = $1`,
    [userId]
  );
  user.mistakes = mistakesRes.rows;

  return user;
};

const toggleUserStatus = async (userId, isActive) => {
  const res = await db.query(
    'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, is_active',
    [isActive, userId]
  );
  if (res.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0];
};

const getQuestions = async ({ courseId, skillCategory, search }) => {
  let query = `
    SELECT q.*, c.title AS course_title, les.title AS lesson_title
    FROM questions q
    LEFT JOIN courses c ON q.course_id = c.id
    LEFT JOIN lessons les ON q.lesson_id = les.id
    WHERE 1=1
  `;
  const params = [];
  let paramIdx = 1;

  if (courseId) {
    query += ` AND q.course_id = $${paramIdx}`;
    params.push(courseId);
    paramIdx++;
  }

  if (skillCategory) {
    query += ` AND q.skill_category = $${paramIdx}`;
    params.push(skillCategory);
    paramIdx++;
  }

  if (search) {
    query += ` AND LOWER(q.prompt) LIKE $${paramIdx}`;
    params.push(`%${search.toLowerCase()}%`);
    paramIdx++;
  }

  query += ' ORDER BY q.id ASC';
  const res = await db.query(query, params);
  return res.rows;
};

const createQuestion = async ({ course_id, lesson_id, question_type, skill_category, prompt, options, correct_answer, explanation, difficulty_level }) => {
  const res = await db.query(
    `INSERT INTO questions (course_id, lesson_id, question_type, skill_category, prompt, options, correct_answer, explanation, difficulty_level)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      course_id,
      lesson_id || null,
      question_type,
      skill_category,
      prompt,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation || '',
      difficulty_level || 'medium',
    ]
  );
  return res.rows[0];
};

const updateQuestion = async (questionId, data) => {
  const { course_id, lesson_id, question_type, skill_category, prompt, options, correct_answer, explanation, difficulty_level } = data;
  const res = await db.query(
    `UPDATE questions
     SET course_id = COALESCE($1, course_id),
         lesson_id = COALESCE($2, lesson_id),
         question_type = COALESCE($3, question_type),
         skill_category = COALESCE($4, skill_category),
         prompt = COALESCE($5, prompt),
         options = COALESCE($6, options),
         correct_answer = COALESCE($7, correct_answer),
         explanation = COALESCE($8, explanation),
         difficulty_level = COALESCE($9, difficulty_level)
     WHERE id = $10
     RETURNING *`,
    [
      course_id,
      lesson_id,
      question_type,
      skill_category,
      prompt,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation,
      difficulty_level,
      questionId,
    ]
  );

  if (res.rows.length === 0) {
    const err = new Error('Question not found');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0];
};

const deleteQuestion = async (questionId) => {
  const res = await db.query('DELETE FROM questions WHERE id = $1 RETURNING id', [questionId]);
  if (res.rows.length === 0) {
    const err = new Error('Question not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Question deleted successfully' };
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetails,
  toggleUserStatus,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
