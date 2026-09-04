const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { signToken } = require('../utils/token');
const config = require('../config/env');

const register = async ({ email, password, full_name, target_language = 'Spanish', proficiency_level = 'Beginner', theme = 'ocean' }) => {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  if (existing.rows.length > 0) {
    const err = new Error('An account with this email address already exists');
    err.statusCode = 409;
    throw err;
  }

  const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, salt);

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Default role is learner (id: 2)
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_active)
       VALUES ($1, $2, $3, 2, true)
       RETURNING id, email, full_name, role_id, created_at`,
      [email.toLowerCase().trim(), passwordHash, full_name.trim()]
    );
    const user = userRes.rows[0];

    // Create profile
    await client.query(
      `INSERT INTO user_profiles (user_id, target_language, proficiency_level, theme, appearance)
       VALUES ($1, $2, $3, $4, 'light')`,
      [user.id, target_language, proficiency_level, theme]
    );

    // Initialize learning streak
    await client.query(
      `INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
       VALUES ($1, 1, 1, CURRENT_DATE)`,
      [user.id]
    );

    // Initialize skill profiles for all 5 dimensions
    const categories = ['grammar', 'vocabulary', 'reading', 'sentence_formation', 'comprehension'];
    for (const cat of categories) {
      await client.query(
        `INSERT INTO skill_profiles (user_id, skill_category, proficiency_score, assessments_taken)
         VALUES ($1, $2, 50.0, 0)`,
        [user.id, cat]
      );
    }

    // Initialize daily mission
    await client.query(
      `INSERT INTO daily_missions (user_id, mission_date, lesson_completed, vocab_practiced, assessment_completed)
       VALUES ($1, CURRENT_DATE, false, false, false)`,
      [user.id]
    );

    // Welcome bonus points
    await client.query(
      `INSERT INTO points_ledger (user_id, points, reason, reference_id)
       VALUES ($1, 50, 'Welcome to LinguaLearn!', 'welcome_bonus')`,
      [user.id]
    );

    await client.query('COMMIT');

    const token = signToken({ userId: user.id, email: user.email, role: 'learner' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: 'learner',
        target_language,
        proficiency_level,
        theme,
        appearance: 'light',
      },
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const login = async ({ email, password }) => {
  const result = await db.query(
    `SELECT u.id, u.email, u.password_hash, u.full_name, u.is_active, r.name AS role,
            p.target_language, p.proficiency_level, p.theme, p.appearance, p.avatar_url
     FROM users u
     JOIN roles r ON u.role_id = r.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.email = $1`,
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const user = result.rows[0];

  if (!user.is_active) {
    const err = new Error('This account has been deactivated by an administrator');
    err.statusCode = 403;
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Update last active date & activity log
  await db.query('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
  await db.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
     VALUES ($1, 'LOGIN', 'USER', $2)`,
    [user.id, String(user.id)]
  );

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      target_language: user.target_language || 'Spanish',
      proficiency_level: user.proficiency_level || 'Beginner',
      theme: user.theme || 'ocean',
      appearance: user.appearance || 'system',
      avatar_url: user.avatar_url,
    },
  };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const res = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
  if (res.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const valid = await bcrypt.compare(currentPassword, res.rows[0].password_hash);
  if (!valid) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }

  const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
  const newHash = await bcrypt.hash(newPassword, salt);
  await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, userId]);

  return { message: 'Password changed successfully' };
};

const getMe = async (userId) => {
  const result = await db.query(
    `SELECT u.id, u.email, u.full_name, u.is_active, u.created_at, r.name AS role,
            p.target_language, p.proficiency_level, p.daily_goal_minutes, 
            p.learning_preferences, p.theme, p.appearance, p.avatar_url, p.bio
     FROM users u
     JOIN roles r ON u.role_id = r.id
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return result.rows[0];
};

module.exports = {
  register,
  login,
  changePassword,
  getMe,
};
