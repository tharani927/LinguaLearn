const db = require('../config/db');

const getLessonById = async (lessonId, userId = null) => {
  const lessonRes = await db.query(
    `SELECT les.*, c.title AS course_title, c.level AS course_level, l.name AS language_name, l.flag_emoji
     FROM lessons les
     JOIN courses c ON les.course_id = c.id
     JOIN languages l ON c.language_id = l.id
     WHERE les.id = $1`,
    [lessonId]
  );

  if (lessonRes.rows.length === 0) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }

  const lesson = lessonRes.rows[0];

  // Fetch vocabulary associated with lesson
  const vocabRes = await db.query(
    'SELECT * FROM vocabulary WHERE lesson_id = $1 ORDER BY id ASC',
    [lessonId]
  );
  lesson.vocabulary = vocabRes.rows;

  // Fetch associated assessment
  const assessRes = await db.query(
    'SELECT id, title, description, passing_score, time_limit_minutes FROM assessments WHERE lesson_id = $1 AND is_active = true LIMIT 1',
    [lessonId]
  );
  lesson.assessment = assessRes.rows.length > 0 ? assessRes.rows[0] : null;

  if (userId) {
    // Record or update lesson progress as in_progress
    await db.query(
      `INSERT INTO learning_progress (user_id, course_id, lesson_id, status, last_accessed_at)
       VALUES ($1, $2, $3, 'in_progress', CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET last_accessed_at = CURRENT_TIMESTAMP`,
      [userId, lesson.course_id, lessonId]
    );

    const progressRes = await db.query(
      'SELECT status, completed_at FROM learning_progress WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );
    lesson.userProgress = progressRes.rows.length > 0 ? progressRes.rows[0] : null;
  }

  return lesson;
};

const completeLesson = async (userId, lessonId) => {
  const lessonRes = await db.query('SELECT course_id, title FROM lessons WHERE id = $1', [lessonId]);
  if (lessonRes.rows.length === 0) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }
  const { course_id, title } = lessonRes.rows[0];

  // Mark lesson as completed
  await db.query(
    `INSERT INTO learning_progress (user_id, course_id, lesson_id, status, completed_at, last_accessed_at)
     VALUES ($1, $2, $3, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET status = 'completed', completed_at = CURRENT_TIMESTAMP, last_accessed_at = CURRENT_TIMESTAMP`,
    [userId, course_id, lessonId]
  );

  // Award 20 points
  await db.query(
    `INSERT INTO points_ledger (user_id, points, reason, reference_id)
     VALUES ($1, 20, $2, $3)`,
    [userId, `Completed lesson: ${title}`, `lesson_${lessonId}`]
  );

  // Update daily mission
  await db.query(
    `INSERT INTO daily_missions (user_id, mission_date, lesson_completed)
     VALUES ($1, CURRENT_DATE, true)
     ON CONFLICT (user_id, mission_date)
     DO UPDATE SET lesson_completed = true`,
    [userId]
  );

  // Check if all lessons in course are completed
  const totalLessonsRes = await db.query(
    'SELECT COUNT(*)::int AS count FROM lessons WHERE course_id = $1',
    [course_id]
  );
  const completedLessonsRes = await db.query(
    `SELECT COUNT(*)::int AS count FROM learning_progress 
     WHERE user_id = $1 AND course_id = $2 AND status = 'completed'`,
    [userId, course_id]
  );

  let courseCompleted = false;
  if (
    totalLessonsRes.rows[0].count > 0 &&
    totalLessonsRes.rows[0].count === completedLessonsRes.rows[0].count
  ) {
    courseCompleted = true;
    await db.query(
      `UPDATE course_enrollments
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND course_id = $2`,
      [userId, course_id]
    );
  }

  return {
    success: true,
    lessonId,
    courseCompleted,
    pointsAwarded: 20,
    message: courseCompleted ? 'Congratulations! You completed the entire course!' : 'Lesson completed successfully!',
  };
};

const getVocabularyByLesson = async (lessonId) => {
  const res = await db.query('SELECT * FROM vocabulary WHERE lesson_id = $1 ORDER BY id ASC', [lessonId]);
  return res.rows;
};

const createLesson = async ({ course_id, title, description, order_index, lesson_type, content, grammar_notes, estimated_minutes }) => {
  const res = await db.query(
    `INSERT INTO lessons (course_id, title, description, order_index, lesson_type, content, grammar_notes, estimated_minutes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [course_id, title, description, order_index || 1, lesson_type || 'mixed', content, grammar_notes || '', estimated_minutes || 15]
  );
  return res.rows[0];
};

const updateLesson = async (lessonId, data) => {
  const { title, description, order_index, lesson_type, content, grammar_notes, estimated_minutes } = data;
  const res = await db.query(
    `UPDATE lessons
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         order_index = COALESCE($3, order_index),
         lesson_type = COALESCE($4, lesson_type),
         content = COALESCE($5, content),
         grammar_notes = COALESCE($6, grammar_notes),
         estimated_minutes = COALESCE($7, estimated_minutes)
     WHERE id = $8
     RETURNING *`,
    [title, description, order_index, lesson_type, content, grammar_notes, estimated_minutes, lessonId]
  );

  if (res.rows.length === 0) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0];
};

const deleteLesson = async (lessonId) => {
  const res = await db.query('DELETE FROM lessons WHERE id = $1 RETURNING id', [lessonId]);
  if (res.rows.length === 0) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Lesson deleted successfully' };
};

module.exports = {
  getLessonById,
  completeLesson,
  getVocabularyByLesson,
  createLesson,
  updateLesson,
  deleteLesson,
};
