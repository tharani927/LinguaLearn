const db = require('../config/db');

const getCourses = async ({ language, level, search, userId = null }) => {
  let query = `
    SELECT c.id, c.title, c.description, c.level, c.thumbnail_url, c.estimated_hours,
           c.is_published, c.created_at, l.name AS language_name, l.code AS language_code, l.flag_emoji,
           (SELECT COUNT(*)::int FROM lessons les WHERE les.course_id = c.id) AS lesson_count,
           (SELECT COUNT(*)::int FROM course_enrollments ce WHERE ce.course_id = c.id) AS student_count
           ${userId ? `, (SELECT status FROM course_enrollments ce WHERE ce.course_id = c.id AND ce.user_id = $1) AS enrollment_status` : ''}
    FROM courses c
    JOIN languages l ON c.language_id = l.id
    WHERE c.is_published = true
  `;
  const params = [];
  let paramIdx = 1;

  if (userId) {
    params.push(userId);
    paramIdx++;
  }

  if (language) {
    query += ` AND (l.code = $${paramIdx} OR LOWER(l.name) = LOWER($${paramIdx}))`;
    params.push(language);
    paramIdx++;
  }

  if (level) {
    query += ` AND LOWER(c.level) = LOWER($${paramIdx})`;
    params.push(level);
    paramIdx++;
  }

  if (search) {
    query += ` AND (LOWER(c.title) LIKE $${paramIdx} OR LOWER(c.description) LIKE $${paramIdx})`;
    params.push(`%${search.toLowerCase()}%`);
    paramIdx++;
  }

  query += ' ORDER BY c.id ASC';

  const result = await db.query(query, params);
  return result.rows;
};

const getCourseById = async (courseId, userId = null) => {
  const courseRes = await db.query(
    `SELECT c.*, l.name AS language_name, l.code AS language_code, l.flag_emoji,
            (SELECT COUNT(*)::int FROM lessons WHERE course_id = c.id) AS lesson_count
     FROM courses c
     JOIN languages l ON c.language_id = l.id
     WHERE c.id = $1`,
    [courseId]
  );

  if (courseRes.rows.length === 0) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }

  const course = courseRes.rows[0];

  // Fetch lessons
  const lessonsRes = await db.query(
    `SELECT les.id, les.title, les.description, les.order_index, les.lesson_type, les.estimated_minutes,
            (SELECT COUNT(*)::int FROM vocabulary WHERE lesson_id = les.id) AS vocab_count,
            (SELECT id FROM assessments WHERE lesson_id = les.id LIMIT 1) AS assessment_id
            ${userId ? `, (SELECT status FROM learning_progress WHERE user_id = $2 AND lesson_id = les.id) AS user_status` : ''}
     FROM lessons les
     WHERE les.course_id = $1
     ORDER BY les.order_index ASC`,
    userId ? [courseId, userId] : [courseId]
  );

  course.lessons = lessonsRes.rows;

  if (userId) {
    const enrollRes = await db.query(
      'SELECT status, enrolled_at, completed_at FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    course.enrollment = enrollRes.rows.length > 0 ? enrollRes.rows[0] : null;

    // Calculate progress percentage
    if (course.lessons.length > 0) {
      const completedCount = course.lessons.filter((l) => l.user_status === 'completed').length;
      course.progressPercentage = Math.round((completedCount / course.lessons.length) * 100);
    } else {
      course.progressPercentage = 0;
    }
  }

  return course;
};

const enrollCourse = async (userId, courseId) => {
  const existing = await db.query(
    'SELECT * FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const res = await db.query(
    `INSERT INTO course_enrollments (user_id, course_id, status)
     VALUES ($1, $2, 'in_progress')
     RETURNING *`,
    [userId, courseId]
  );

  // Award bonus points for starting a course
  await db.query(
    `INSERT INTO points_ledger (user_id, points, reason, reference_id)
     VALUES ($1, 25, 'Enrolled in new course', $2)`,
    [userId, `enroll_${courseId}`]
  );

  return res.rows[0];
};

const createCourse = async ({ language_id, title, description, level, thumbnail_url, estimated_hours, created_by }) => {
  const res = await db.query(
    `INSERT INTO courses (language_id, title, description, level, thumbnail_url, estimated_hours, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [language_id, title, description, level, thumbnail_url, estimated_hours || 5.0, created_by]
  );
  return res.rows[0];
};

const updateCourse = async (courseId, data) => {
  const { title, description, level, thumbnail_url, estimated_hours, is_published, language_id } = data;
  const res = await db.query(
    `UPDATE courses
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         level = COALESCE($3, level),
         thumbnail_url = COALESCE($4, thumbnail_url),
         estimated_hours = COALESCE($5, estimated_hours),
         is_published = COALESCE($6, is_published),
         language_id = COALESCE($7, language_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $8
     RETURNING *`,
    [title, description, level, thumbnail_url, estimated_hours, is_published, language_id, courseId]
  );

  if (res.rows.length === 0) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0];
};

const deleteCourse = async (courseId) => {
  const res = await db.query('DELETE FROM courses WHERE id = $1 RETURNING id', [courseId]);
  if (res.rows.length === 0) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Course deleted successfully' };
};

module.exports = {
  getCourses,
  getCourseById,
  enrollCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
