const db = require('../config/db');

const getProfile = async (userId) => {
  const res = await db.query(
    `SELECT u.id, u.email, u.full_name, r.name AS role,
            p.target_language, p.proficiency_level, p.daily_goal_minutes,
            p.learning_preferences, p.theme, p.appearance, p.avatar_url, p.bio,
            COALESCE(SUM(pl.points), 0)::int AS total_points,
            COALESCE(ls.current_streak, 0) AS current_streak,
            COALESCE(ls.longest_streak, 0) AS longest_streak
     FROM users u
     JOIN roles r ON u.role_id = r.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     LEFT JOIN points_ledger pl ON u.id = pl.user_id
     LEFT JOIN learning_streaks ls ON u.id = ls.user_id
     WHERE u.id = $1
     GROUP BY u.id, u.email, u.full_name, r.name, p.target_language, 
              p.proficiency_level, p.daily_goal_minutes, p.learning_preferences,
              p.theme, p.appearance, p.avatar_url, p.bio, ls.current_streak, ls.longest_streak`,
    [userId]
  );

  if (res.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return res.rows[0];
};

const updateProfile = async (userId, data) => {
  const { full_name, target_language, proficiency_level, daily_goal_minutes, bio, avatar_url, learning_preferences } = data;

  if (full_name) {
    await db.query('UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [full_name, userId]);
  }

  await db.query(
    `UPDATE user_profiles
     SET target_language = COALESCE($1, target_language),
         proficiency_level = COALESCE($2, proficiency_level),
         daily_goal_minutes = COALESCE($3, daily_goal_minutes),
         bio = COALESCE($4, bio),
         avatar_url = COALESCE($5, avatar_url),
         learning_preferences = COALESCE($6, learning_preferences),
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $7`,
    [target_language, proficiency_level, daily_goal_minutes, bio, avatar_url, learning_preferences ? JSON.stringify(learning_preferences) : null, userId]
  );

  return getProfile(userId);
};

const updateTheme = async (userId, { theme, appearance }) => {
  const validThemes = ['ocean', 'nature', 'bloom', 'midnight', 'sunrise'];
  const validModes = ['light', 'dark', 'system'];

  const themeVal = validThemes.includes(theme) ? theme : undefined;
  const appearanceVal = validModes.includes(appearance) ? appearance : undefined;

  await db.query(
    `UPDATE user_profiles
     SET theme = COALESCE($1, theme),
         appearance = COALESCE($2, appearance),
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3`,
    [themeVal, appearanceVal, userId]
  );

  return { theme: themeVal, appearance: appearanceVal, message: 'Theme preferences updated successfully' };
};

const getUserStats = async (userId) => {
  // Lessons completed
  const lessonsRes = await db.query(
    `SELECT COUNT(*)::int AS completed_lessons
     FROM learning_progress
     WHERE user_id = $1 AND status = 'completed'`,
    [userId]
  );

  // Assessments taken & average score
  const assessRes = await db.query(
    `SELECT COUNT(*)::int AS assessments_taken,
            COALESCE(AVG(score), 0)::numeric(5,2) AS average_score,
            COALESCE(MAX(score), 0)::numeric(5,2) AS highest_score
     FROM assessment_results
     WHERE user_id = $1`,
    [userId]
  );

  // Mistakes in vault (total vs mastered)
  const mistakesRes = await db.query(
    `SELECT COUNT(*)::int AS total_mistakes,
            COUNT(CASE WHEN mastered THEN 1 END)::int AS mastered_mistakes
     FROM mistake_vault
     WHERE user_id = $1`,
    [userId]
  );

  // Enrolled courses
  const enrollRes = await db.query(
    `SELECT COUNT(*)::int AS enrolled_courses,
            COUNT(CASE WHEN status = 'completed' THEN 1 END)::int AS completed_courses
     FROM course_enrollments
     WHERE user_id = $1`,
    [userId]
  );

  // Certificates earned
  const certRes = await db.query(
    `SELECT COUNT(*)::int AS certificates_count
     FROM certificates
     WHERE user_id = $1`,
    [userId]
  );

  return {
    completedLessons: lessonsRes.rows[0].completed_lessons,
    assessmentsTaken: assessRes.rows[0].assessments_taken,
    averageScore: parseFloat(assessRes.rows[0].average_score),
    highestScore: parseFloat(assessRes.rows[0].highest_score),
    totalMistakes: mistakesRes.rows[0].total_mistakes,
    masteredMistakes: mistakesRes.rows[0].mastered_mistakes,
    enrolledCourses: enrollRes.rows[0].enrolled_courses,
    completedCourses: enrollRes.rows[0].completed_courses,
    certificatesCount: certRes.rows[0].certificates_count,
  };
};

module.exports = {
  getProfile,
  updateProfile,
  updateTheme,
  getUserStats,
};
