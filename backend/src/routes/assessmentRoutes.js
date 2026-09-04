const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticate } = require('../middleware/auth');
const { validateAssessmentSubmit } = require('../validators');

router.use(authenticate);
router.get('/history', assessmentController.getHistory);
router.get('/result/:id', assessmentController.getResult);
router.get('/:id', assessmentController.getAssessment);
router.post('/:id/submit', validateAssessmentSubmit, assessmentController.submitAssessment);

module.exports = router;
