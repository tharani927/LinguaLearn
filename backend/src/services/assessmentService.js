const db = require('../config/db');
const adaptiveService = require('./adaptiveLearningService');
const aiService = require('./aiService');
const gamificationService = require('./gamificationService');

const getAssessmentById = async (assessmentId) => {
  const assessRes = await db.query(
    `SELECT a.*, c.title AS course_title, c.level AS course_level, les.title AS lesson_title
     FROM assessments a
     JOIN courses c ON a.course_id = c.id
     LEFT JOIN lessons les ON a.lesson_id = les.id
     WHERE a.id = $1 AND a.is_active = true`,
    [assessmentId]
  );

  if (assessRes.rows.length === 0) {
    const err = new Error('Assessment not found');
    err.statusCode = 404;
    throw err;
  }

  const assessment = assessRes.rows[0];

  // Fetch mapped questions (without exposing correct_answer before submit!)
  const questionsRes = await db.query(
    `SELECT q.id, q.prompt, q.options, q.question_type, q.skill_category, q.difficulty_level,
            aq.points, aq.order_index
     FROM assessment_questions aq
     JOIN questions q ON aq.question_id = q.id
     WHERE aq.assessment_id = $1
     ORDER BY aq.order_index ASC`,
    [assessmentId]
  );

  assessment.questions = questionsRes.rows;
  return assessment;
};

const submitAssessment = async (userId, assessmentId, answers, timeSpentSeconds = 0) => {
  // 1. Fetch assessment and questions with correct answers
  const assessRes = await db.query(
    'SELECT id, passing_score, course_id, title FROM assessments WHERE id = $1',
    [assessmentId]
  );
  if (assessRes.rows.length === 0) {
    const err = new Error('Assessment not found');
    err.statusCode = 404;
    throw err;
  }
  const assessment = assessRes.rows[0];

  const questionsRes = await db.query(
    `SELECT q.id, q.correct_answer, q.explanation, q.skill_category, aq.points
     FROM assessment_questions aq
     JOIN questions q ON aq.question_id = q.id
     WHERE aq.assessment_id = $1`,
    [assessmentId]
  );

  const questionMap = new Map();
  let totalPossiblePoints = 0;
  questionsRes.rows.forEach((q) => {
    questionMap.set(q.id, q);
    totalPossiblePoints += q.points;
  });

  // 2. Score the answers
  let earnedPoints = 0;
  let correctCount = 0;
  const userAnswersProcessed = [];

  for (const item of answers) {
    const question = questionMap.get(item.question_id);
    if (!question) continue;

    const isCorrect = (item.user_answer || '').trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
    const pointsAwarded = isCorrect ? question.points : 0;

    if (isCorrect) {
      correctCount += 1;
      earnedPoints += pointsAwarded;
    }

    userAnswersProcessed.push({
      question_id: item.question_id,
      user_answer: item.user_answer,
      is_correct: isCorrect,
      points_awarded: pointsAwarded,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      skill_category: question.skill_category,
    });
  }

  const scorePercentage = totalPossiblePoints > 0
    ? Math.round((earnedPoints / totalPossiblePoints) * 100)
    : 0;
  const passed = scorePercentage >= assessment.passing_score;

  // 3. Insert into assessment_results
  const resultRes = await db.query(
    `INSERT INTO assessment_results (assessment_id, user_id, score, total_questions, correct_answers, passed, time_spent_seconds)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, score, total_questions, correct_answers, passed, completed_at`,
    [
      assessmentId,
      userId,
      scorePercentage,
      questionMap.size,
      correctCount,
      passed,
      timeSpentSeconds,
    ]
  );
  const resultId = resultRes.rows[0].id;

  // 4. Save individual user answers
  for (const item of userAnswersProcessed) {
    await db.query(
      `INSERT INTO user_answers (assessment_result_id, question_id, user_answer, is_correct, points_awarded)
       VALUES ($1, $2, $3, $4, $5)`,
      [resultId, item.question_id, item.user_answer, item.is_correct, item.points_awarded]
    );
  }

  // 5. Update adaptive skill profiles and mistake vault
  await adaptiveService.updateSkillsAndMistakes(userId, userAnswersProcessed, scorePercentage);

  // 6. Generate AI/Deterministic feedback
  const feedback = await aiService.analyzeAssessment(
    resultId,
    userId,
    scorePercentage,
    questionMap.size,
    userAnswersProcessed
  );

  // 7. Update gamification & missions
  await gamificationService.updateDailyMission(userId, 'assessment');
  await gamificationService.updateStreak(userId);

  // Points for taking assessment
  const earnedBonus = passed ? 40 : 15;
  await db.query(
    `INSERT INTO points_ledger (user_id, points, reason, reference_id)
     VALUES ($1, $2, $3, $4)`,
    [userId, earnedBonus, `Assessment: ${assessment.title} (${scorePercentage}%)`, `assess_${resultId}`]
  );

  const newlyUnlockedAchievements = await gamificationService.evaluateAchievements(userId);

  return {
    resultId,
    assessmentId,
    assessmentTitle: assessment.title,
    score: scorePercentage,
    passingScore: assessment.passing_score,
    passed,
    correctAnswers: correctCount,
    totalQuestions: questionMap.size,
    earnedPoints: earnedBonus,
    feedback,
    answers: userAnswersProcessed,
    newlyUnlockedAchievements,
  };
};

const getAssessmentHistory = async (userId) => {
  const res = await db.query(
    `SELECT ar.*, a.title AS assessment_title, c.title AS course_title
     FROM assessment_results ar
     JOIN assessments a ON ar.assessment_id = a.id
     JOIN courses c ON a.course_id = c.id
     WHERE ar.user_id = $1
     ORDER BY ar.completed_at DESC`,
    [userId]
  );
  return res.rows;
};

const getAssessmentResultById = async (resultId, userId) => {
  const res = await db.query(
    `SELECT ar.*, a.title AS assessment_title, a.passing_score,
            af.overall_summary, af.strengths, af.weaknesses, af.recommendations, af.engine_used
     FROM assessment_results ar
     JOIN assessments a ON ar.assessment_id = a.id
     LEFT JOIN ai_feedback af ON ar.id = af.assessment_result_id
     WHERE ar.id = $1 AND (ar.user_id = $2 OR (SELECT role_id FROM users WHERE id = $2) = 1)`,
    [resultId, userId]
  );

  if (res.rows.length === 0) {
    const err = new Error('Assessment result not found');
    err.statusCode = 404;
    throw err;
  }

  const result = res.rows[0];

  // Fetch question details and user's answers
  const answersRes = await db.query(
    `SELECT ua.user_answer, ua.is_correct, ua.points_awarded,
            q.id AS question_id, q.prompt, q.correct_answer, q.explanation, q.skill_category
     FROM user_answers ua
     JOIN questions q ON ua.question_id = q.id
     WHERE ua.assessment_result_id = $1`,
    [resultId]
  );

  result.answers = answersRes.rows;
  return result;
};

module.exports = {
  getAssessmentById,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentResultById,
};
