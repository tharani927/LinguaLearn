const adaptiveService = require('../services/adaptiveLearningService');
const { success } = require('../utils/response');

const getMistakeVault = async (req, res, next) => {
  try {
    const mastered = req.query.mastered !== undefined ? req.query.mastered === 'true' : null;
    const items = await adaptiveService.getMistakeVault(req.user.id, { mastered });
    return success(res, items);
  } catch (err) {
    next(err);
  }
};

const practiceMistake = async (req, res, next) => {
  try {
    const { user_answer } = req.body;
    const result = await adaptiveService.practiceMistake(
      req.user.id,
      parseInt(req.params.questionId, 10),
      user_answer
    );
    return success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

const getSkillProfile = async (req, res, next) => {
  try {
    const skills = await adaptiveService.getSkillProfile(req.user.id);
    return success(res, skills);
  } catch (err) {
    next(err);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await adaptiveService.getRecommendations(req.user.id);
    return success(res, recommendations);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMistakeVault,
  practiceMistake,
  getSkillProfile,
  getRecommendations,
};
