const db = require('../config/db');

const getUserProgressReport = async () => {
  const res = await db.query(
    `SELECT u.id AS user_id, u.full_name, u.email,
            p.target_language, p.proficiency_level,
            COALESCE(ls.current_streak, 0) AS streak,
            (SELECT COUNT(*)::int FROM course_enrollments WHERE user_id = u.id) AS enrolled_courses,
            (SELECT COUNT(*)::int FROM learning_progress WHERE user_id = u.id AND status = 'completed') AS completed_lessons,
            (SELECT COUNT(*)::int FROM assessment_results WHERE user_id = u.id) AS assessments_taken,
            (SELECT COALESCE(ROUND(AVG(score), 1), 0) FROM assessment_results WHERE user_id = u.id) AS avg_score,
            (SELECT COUNT(*)::int FROM certificates WHERE user_id = u.id) AS certificates_earned
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.user_id
     LEFT JOIN learning_streaks ls ON u.id = ls.user_id
     WHERE u.role_id = 2
     ORDER BY u.id ASC`
  );
  return res.rows;
};

const getAssessmentReport = async () => {
  const res = await db.query(
    `SELECT ar.id AS result_id, u.full_name AS learner_name, u.email,
            a.title AS assessment_title, c.title AS course_title,
            ar.score, ar.passed, ar.correct_answers, ar.total_questions,
            ar.time_spent_seconds, ar.completed_at
     FROM assessment_results ar
     JOIN users u ON ar.user_id = u.id
     JOIN assessments a ON ar.assessment_id = a.id
     JOIN courses c ON a.course_id = c.id
     ORDER BY ar.completed_at DESC`
  );
  return res.rows;
};

const getCourseCompletionReport = async () => {
  const res = await db.query(
    `SELECT c.id AS course_id, c.title, l.name AS language, c.level,
            COUNT(ce.id)::int AS total_enrolled,
            COUNT(CASE WHEN ce.status = 'completed' THEN 1 END)::int AS total_completed,
            ROUND((COUNT(CASE WHEN ce.status = 'completed' THEN 1 END)::numeric / NULLIF(COUNT(ce.id), 0) * 100), 1) AS completion_percentage
     FROM courses c
     JOIN languages l ON c.language_id = l.id
     LEFT JOIN course_enrollments ce ON c.id = ce.course_id
     GROUP BY c.id, c.title, l.name, c.level
     ORDER BY total_enrolled DESC`
  );
  return res.rows;
};

const convertToCSV = (rows) => {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map((header) => {
      const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvLines.push(values.join(','));
  }

  return csvLines.join('\n');
};

module.exports = {
  getUserProgressReport,
  getAssessmentReport,
  getCourseCompletionReport,
  convertToCSV,
};
