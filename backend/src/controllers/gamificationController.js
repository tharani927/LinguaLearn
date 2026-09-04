const gamificationService = require('../services/gamificationService');
const { success } = require('../utils/response');

const getStreak = async (req, res, next) => {
  try {
    const streak = await gamificationService.updateStreak(req.user.id);
    return success(res, streak);
  } catch (err) {
    next(err);
  }
};

const getDailyMission = async (req, res, next) => {
  try {
    const mission = await gamificationService.getDailyMission(req.user.id);
    return success(res, mission);
  } catch (err) {
    next(err);
  }
};

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await gamificationService.getAchievements(req.user.id);
    return success(res, achievements);
  } catch (err) {
    next(err);
  }
};

const generateCertificate = async (req, res, next) => {
  try {
    const cert = await gamificationService.generateCertificate(
      req.user.id,
      parseInt(req.params.courseId, 10)
    );
    return success(res, cert, 'Certificate issued successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getCertificates = async (req, res, next) => {
  try {
    const certs = await gamificationService.getCertificates(req.user.id);
    return success(res, certs);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStreak,
  getDailyMission,
  getAchievements,
  generateCertificate,
  getCertificates,
};
