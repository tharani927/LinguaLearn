const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validateCourse } = require('../validators');

// Optional auth for catalog viewing
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, courseController.getCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);
router.post('/:id/enroll', authenticate, courseController.enrollCourse);

// Admin only
router.post('/', authenticate, requireRole('admin'), validateCourse, courseController.createCourse);
router.put('/:id', authenticate, requireRole('admin'), courseController.updateCourse);
router.delete('/:id', authenticate, requireRole('admin'), courseController.deleteCourse);

module.exports = router;
