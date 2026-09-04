const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.use(authenticate, requireRole('admin'));
router.get('/difficult-topics', analyticsController.getDifficultTopics);
router.get('/at-risk-learners', analyticsController.getAtRiskLearners);
router.get('/skill-distribution', analyticsController.getSkillDistribution);

module.exports = router;
