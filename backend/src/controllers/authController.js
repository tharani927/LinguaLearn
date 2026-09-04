const authService = require('../services/authService');
const { success } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return success(res, data, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return success(res, data, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    return success(res, result, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
};
