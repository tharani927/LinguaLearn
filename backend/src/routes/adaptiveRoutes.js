const express = require('express');
const router = express.Router();
const adaptiveController = require('../controllers/adaptiveController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/mistakes', adaptiveController.getMistakeVault);
router.post('/mistakes/:questionId/practice', adaptiveController.practiceMistake);
router.get('/skills', adaptiveController.getSkillProfile);
router.get('/recommendations', adaptiveController.getRecommendations);

module.exports = router;
