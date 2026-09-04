const { error } = require('../utils/response');

const validateRegister = (req, res, next) => {
  const { email, password, full_name } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!full_name || full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
};

const validateAssessmentSubmit = (req, res, next) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return error(res, 'Assessment submission must contain an array of answers', 400);
  }
  next();
};

const validateCourse = (req, res, next) => {
  const { title, language_id, level } = req.body;
  const errors = [];
  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters');
  if (!language_id) errors.push('language_id is required');
  if (!level || !['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
    errors.push('Level must be Beginner, Intermediate, or Advanced');
  }
  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
};

const validateLesson = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];
  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters');
  if (!content || content.trim().length < 10) errors.push('Content must be at least 10 characters');
  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
};

const validateQuestion = (req, res, next) => {
  const { prompt, correct_answer, question_type, skill_category } = req.body;
  const errors = [];
  if (!prompt) errors.push('Prompt is required');
  if (!correct_answer) errors.push('Correct answer is required');
  if (!question_type) errors.push('question_type is required');
  if (!skill_category) errors.push('skill_category is required');
  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAssessmentSubmit,
  validateCourse,
  validateLesson,
  validateQuestion,
};
