const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/streak', gamificationController.getStreak);
router.get('/daily-mission', gamificationController.getDailyMission);
router.get('/achievements', gamificationController.getAchievements);
router.post('/certificate/:courseId', gamificationController.generateCertificate);
router.get('/certificates', gamificationController.getCertificates);

module.exports = router;
