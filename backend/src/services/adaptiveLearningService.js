const db = require('../config/db');

const updateSkillsAndMistakes = async (userId, userAnswers, totalScorePercentage) => {
  // 1. Group answers by skill category
  const skillStats = {};

  for (const item of userAnswers) {
    const { question_id, is_correct, user_answer } = item;
    const qRes = await db.query(
      'SELECT skill_category, prompt, correct_answer FROM questions WHERE id = $1',
      [question_id]
    );

    if (qRes.rows.length === 0) continue;
    const { skill_category } = qRes.rows[0];

    if (!skillStats[skill_category]) {
      skillStats[skill_category] = { total: 0, correct: 0 };
    }
    skillStats[skill_category].total += 1;
    if (is_correct) {
      skillStats[skill_category].correct += 1;
    } else {
      // Record in Mistake Vault
      await db.query(
        `INSERT INTO mistake_vault (user_id, question_id, mistake_count, last_wrong_answer, mastered, last_practiced_at)
         VALUES ($1, $2, 1, $3, false, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, question_id)
         DO UPDATE SET 
           mistake_count = mistake_vault.mistake_count + 1,
           last_wrong_answer = EXCLUDED.last_wrong_answer,
           mastered = false,
           last_practiced_at = CURRENT_TIMESTAMP`,
        [userId, question_id, user_answer]
      );
    }
  }

  // 2. Update Skill Profiles
  for (const [skill, stats] of Object.entries(skillStats)) {
    const sessionScore = (stats.correct / stats.total) * 100;
    
    // Weighted update: 70% previous proficiency, 30% current session
    await db.query(
      `INSERT INTO skill_profiles (user_id, skill_category, proficiency_score, assessments_taken, last_evaluated_at)
       VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, skill_category)
       DO UPDATE SET 
         proficiency_score = ROUND(((skill_profiles.proficiency_score * 0.7) + ($3 * 0.3))::numeric, 2),
         assessments_taken = skill_profiles.assessments_taken + 1,
         last_evaluated_at = CURRENT_TIMESTAMP`,
      [userId, skill, sessionScore]
    );
  }

  // 3. Generate Adaptive Recommendations
  await generateAdaptiveRecommendations(userId, totalScorePercentage, skillStats);
};

const generateAdaptiveRecommendations = async (userId, scorePercentage, skillStats) => {
  // Clear previous pending recommendations to keep focus fresh
  await db.query('DELETE FROM recommendations WHERE user_id = $1 AND is_completed = false', [userId]);

  if (scorePercentage < 70) {
    // Adaptive branch: Needs remediation
    const lowestSkill = Object.entries(skillStats).sort(
      (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total
    )[0];

    const weakSkillName = lowestSkill ? lowestSkill[0].replace('_', ' ') : 'core grammar';

    await db.query(
      `INSERT INTO recommendations (user_id, title, recommendation_type, reason)
       VALUES ($1, $2, 'practice_mistakes', $3)`,
      [
        userId,
        `Strengthen Weak Area: ${weakSkillName.toUpperCase()}`,
        `Your score was ${Math.round(scorePercentage)}%. Reviewing your missed questions in the Mistake Vault will quickly reinforce these core concepts.`,
      ]
    );
  } else {
    // Adaptive branch: Advanced progression
    await db.query(
      `INSERT INTO recommendations (user_id, title, recommendation_type, reason)
       VALUES ($1, 'Progress to Next Milestone Lesson', 'lesson', $2)`,
      [
        userId,
        `Great job! With a score of ${Math.round(scorePercentage)}%, you have demonstrated strong grasp of this material. Continue forward to expand your fluency!`,
      ]
    );
  }
};

const getMistakeVault = async (userId, { mastered = null } = {}) => {
  let query = `
    SELECT mv.id AS vault_id, mv.question_id, mv.mistake_count, mv.last_wrong_answer,
           mv.mastered, mv.last_practiced_at, mv.created_at,
           q.prompt, q.options, q.correct_answer, q.explanation, q.question_type,
           q.skill_category, q.difficulty_level, c.title AS course_title
    FROM mistake_vault mv
    JOIN questions q ON mv.question_id = q.id
    LEFT JOIN courses c ON q.course_id = c.id
    WHERE mv.user_id = $1
  `;
  const params = [userId];

  if (mastered !== null) {
    query += ' AND mv.mastered = $2';
    params.push(mastered);
  }

  query += ' ORDER BY mv.mastered ASC, mv.mistake_count DESC, mv.last_practiced_at DESC';

  const res = await db.query(query, params);
  return res.rows;
};

const practiceMistake = async (userId, questionId, userAnswer) => {
  const qRes = await db.query('SELECT correct_answer, explanation FROM questions WHERE id = $1', [questionId]);
  if (qRes.rows.length === 0) {
    const err = new Error('Question not found');
    err.statusCode = 404;
    throw err;
  }

  const { correct_answer, explanation } = qRes.rows[0];
  const isCorrect = userAnswer.trim().toLowerCase() === correct_answer.trim().toLowerCase();

  if (isCorrect) {
    // Mark as mastered
    await db.query(
      `UPDATE mistake_vault 
       SET mastered = true, last_practiced_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND question_id = $2`,
      [userId, questionId]
    );

    // Award 15 mastery bonus points
    await db.query(
      `INSERT INTO points_ledger (user_id, points, reason, reference_id)
       VALUES ($1, 15, 'Mastered a mistake from vault', $2)`,
      [userId, `vault_master_${questionId}`]
    );
  } else {
    // Increment mistake count
    await db.query(
      `UPDATE mistake_vault
       SET mistake_count = mistake_count + 1, last_wrong_answer = $1, last_practiced_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND question_id = $3`,
      [userAnswer, userId, questionId]
    );
  }

  return {
    isCorrect,
    correctAnswer: correct_answer,
    explanation,
    message: isCorrect ? 'Excellent! You conquered this mistake and marked it as mastered!' : 'Not quite yet. Keep practicing to master this concept.',
  };
};

const getSkillProfile = async (userId) => {
  const res = await db.query(
    `SELECT skill_category, proficiency_score, assessments_taken, last_evaluated_at
     FROM skill_profiles
     WHERE user_id = $1
     ORDER BY skill_category ASC`,
    [userId]
  );
  return res.rows;
};

const getRecommendations = async (userId) => {
  const res = await db.query(
    `SELECT * FROM recommendations
     WHERE user_id = $1
     ORDER BY is_completed ASC, created_at DESC`,
    [userId]
  );
  return res.rows;
};

module.exports = {
  updateSkillsAndMistakes,
  getMistakeVault,
  practiceMistake,
  getSkillProfile,
  getRecommendations,
};
