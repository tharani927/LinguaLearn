const { verifyToken } = require('../utils/token');
const { error } = require('../utils/response');
const db = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return error(res, 'Invalid or expired token.', 401);
    }

    const result = await db.query(
      `SELECT u.id, u.email, u.full_name, u.is_active, r.name AS role, 
              p.target_language, p.proficiency_level, p.theme, p.appearance
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return error(res, 'User account no longer exists.', 401);
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return error(res, 'User account is deactivated. Contact an administrator.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authenticate,
};
