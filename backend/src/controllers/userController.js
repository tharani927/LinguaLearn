const userService = require('../services/userService');
const { success } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    return success(res, profile);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await userService.updateProfile(req.user.id, req.body);
    return success(res, updated, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

const updateTheme = async (req, res, next) => {
  try {
    const theme = await userService.updateTheme(req.user.id, req.body);
    return success(res, theme, 'Theme preferences updated');
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats(req.user.id);
    return success(res, stats);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateTheme,
  getStats,
};
