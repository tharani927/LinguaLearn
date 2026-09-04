const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.use(authenticate, requireRole('admin'));
router.get('/progress', reportController.getProgressReport);
router.get('/assessments', reportController.getAssessmentReport);
router.get('/courses', reportController.getCourseReport);

module.exports = router;
