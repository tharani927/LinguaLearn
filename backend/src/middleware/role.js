const { error } = require('../utils/response');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized access.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(
        res,
        `Access forbidden. Requires one of roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
};
