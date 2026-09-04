const reportService = require('../services/reportService');
const { success } = require('../utils/response');

const getProgressReport = async (req, res, next) => {
  try {
    const data = await reportService.getUserProgressReport();
    if (req.query.format === 'csv') {
      const csv = reportService.convertToCSV(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('lingualearn_user_progress.csv');
      return res.send(csv);
    }
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

const getAssessmentReport = async (req, res, next) => {
  try {
    const data = await reportService.getAssessmentReport();
    if (req.query.format === 'csv') {
      const csv = reportService.convertToCSV(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('lingualearn_assessment_outcomes.csv');
      return res.send(csv);
    }
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

const getCourseReport = async (req, res, next) => {
  try {
    const data = await reportService.getCourseCompletionReport();
    if (req.query.format === 'csv') {
      const csv = reportService.convertToCSV(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('lingualearn_course_completion.csv');
      return res.send(csv);
    }
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProgressReport,
  getAssessmentReport,
  getCourseReport,
};
