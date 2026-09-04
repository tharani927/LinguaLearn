const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validateLesson } = require('../validators');

router.get('/:id', authenticate, lessonController.getLessonById);
router.post('/:id/complete', authenticate, lessonController.completeLesson);
router.get('/:id/vocabulary', authenticate, lessonController.getVocabulary);

// Admin only
router.post('/', authenticate, requireRole('admin'), validateLesson, lessonController.createLesson);
router.put('/:id', authenticate, requireRole('admin'), lessonController.updateLesson);
router.delete('/:id', authenticate, requireRole('admin'), lessonController.deleteLesson);

module.exports = router;
