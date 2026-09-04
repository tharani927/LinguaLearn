const lessonService = require('../services/lessonService');
const { success } = require('../utils/response');

const getLessonById = async (req, res, next) => {
  try {
    const lesson = await lessonService.getLessonById(
      parseInt(req.params.id, 10),
      req.user ? req.user.id : null
    );
    return success(res, lesson);
  } catch (err) {
    next(err);
  }
};

const completeLesson = async (req, res, next) => {
  try {
    const result = await lessonService.completeLesson(
      req.user.id,
      parseInt(req.params.id, 10)
    );
    return success(res, result, result.message);
  } catch (err) {
    next(err);
  }
};

const getVocabulary = async (req, res, next) => {
  try {
    const vocab = await lessonService.getVocabularyByLesson(parseInt(req.params.id, 10));
    return success(res, vocab);
  } catch (err) {
    next(err);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    return success(res, lesson, 'Lesson created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.updateLesson(parseInt(req.params.id, 10), req.body);
    return success(res, lesson, 'Lesson updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const result = await lessonService.deleteLesson(parseInt(req.params.id, 10));
    return success(res, result, 'Lesson deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLessonById,
  completeLesson,
  getVocabulary,
  createLesson,
  updateLesson,
  deleteLesson,
};
