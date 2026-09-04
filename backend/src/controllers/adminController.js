const adminService = require('../services/adminService');
const { success } = require('../utils/response');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return success(res, stats);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { search, role, page, limit } = req.query;
    const users = await adminService.getUsers({ search, role, page, limit });
    return success(res, users);
  } catch (err) {
    next(err);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const user = await adminService.getUserDetails(parseInt(req.params.id, 10));
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { is_active } = req.body;
    const updated = await adminService.toggleUserStatus(parseInt(req.params.id, 10), is_active);
    return success(res, updated, 'User status updated');
  } catch (err) {
    next(err);
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const { courseId, skillCategory, search } = req.query;
    const questions = await adminService.getQuestions({ courseId, skillCategory, search });
    return success(res, questions);
  } catch (err) {
    next(err);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const question = await adminService.createQuestion(req.body);
    return success(res, question, 'Question created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const question = await adminService.updateQuestion(parseInt(req.params.id, 10), req.body);
    return success(res, question, 'Question updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const result = await adminService.deleteQuestion(parseInt(req.params.id, 10));
    return success(res, result, 'Question deleted successfully');
  } catch (err) {
    next(err);
  }
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
