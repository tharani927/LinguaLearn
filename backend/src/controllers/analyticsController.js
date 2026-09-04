const analyticsService = require('../services/analyticsService');
const { success } = require('../utils/response');

const getDifficultTopics = async (req, res, next) => {
  try {
    const data = await analyticsService.getTopicDifficultyAnalytics();
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

const getAtRiskLearners = async (req, res, next) => {
  try {
    const data = await analyticsService.getAtRiskLearners();
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

const getSkillDistribution = async (req, res, next) => {
  try {
    const data = await analyticsService.getSkillDistribution();
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDifficultTopics,
  getAtRiskLearners,
  getSkillDistribution,
};
