const assessmentService = require('../services/assessmentService');
const { success } = require('../utils/response');

const getAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.getAssessmentById(parseInt(req.params.id, 10));
    return success(res, assessment);
  } catch (err) {
    next(err);
  }
};

const submitAssessment = async (req, res, next) => {
  try {
    const { answers, time_spent_seconds } = req.body;
    const result = await assessmentService.submitAssessment(
      req.user.id,
      parseInt(req.params.id, 10),
      answers,
      time_spent_seconds || 0
    );
    return success(res, result, 'Assessment graded and analyzed successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await assessmentService.getAssessmentHistory(req.user.id);
    return success(res, history);
  } catch (err) {
    next(err);
  }
};

const getResult = async (req, res, next) => {
  try {
    const result = await assessmentService.getAssessmentResultById(
      parseInt(req.params.id, 10),
      req.user.id
    );
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssessment,
  submitAssessment,
  getHistory,
  getResult,
};
