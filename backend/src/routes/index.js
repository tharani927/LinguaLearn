const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const lessonRoutes = require('./lessonRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const adaptiveRoutes = require('./adaptiveRoutes');
const aiRoutes = require('./aiRoutes');
const gamificationRoutes = require('./gamificationRoutes');
const adminRoutes = require('./adminRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const reportRoutes = require('./reportRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/adaptive', adaptiveRoutes);
router.use('/ai', aiRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/health', healthRoutes);

module.exports = router;
