const courseService = require('../services/courseService');
const { success } = require('../utils/response');

const getCourses = async (req, res, next) => {
  try {
    const { language, level, search } = req.query;
    const courses = await courseService.getCourses({
      language,
      level,
      search,
      userId: req.user ? req.user.id : null,
    });
    return success(res, courses);
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(
      parseInt(req.params.id, 10),
      req.user ? req.user.id : null
    );
    return success(res, course);
  } catch (err) {
    next(err);
  }
};

const enrollCourse = async (req, res, next) => {
  try {
    const enrollment = await courseService.enrollCourse(
      req.user.id,
      parseInt(req.params.id, 10)
    );
    return success(res, enrollment, 'Enrolled in course successfully', 201);
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse({
      ...req.body,
      created_by: req.user.id,
    });
    return success(res, course, 'Course created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(
      parseInt(req.params.id, 10),
      req.body
    );
    return success(res, course, 'Course updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const result = await courseService.deleteCourse(parseInt(req.params.id, 10));
    return success(res, result, 'Course deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  enrollCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
