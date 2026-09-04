const db = require('../config/db');

const updateStreak = async (userId) => {
  const res = await db.query(
    'SELECT current_streak, longest_streak, last_activity_date FROM learning_streaks WHERE user_id = $1',
    [userId]
  );

  const today = new Date().toISOString().split('T')[0];

  if (res.rows.length === 0) {
    await db.query(
      `INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
       VALUES ($1, 1, 1, CURRENT_DATE)`,
      [userId]
    );
    return { currentStreak: 1, longestStreak: 1, streakUpdated: true };
  }

  const { current_streak, longest_streak, last_activity_date } = res.rows[0];
  const lastDateStr = last_activity_date ? new Date(last_activity_date).toISOString().split('T')[0] : null;

  if (lastDateStr === today) {
    return { currentStreak: current_streak, longestStreak: longest_streak, streakUpdated: false };
  }

  const lastDate = new Date(lastDateStr);
  const currentDate = new Date(today);
  const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

  let newStreak = 1;
  if (diffDays === 1) {
    newStreak = current_streak + 1;
  }

  const newLongest = Math.max(longest_streak, newStreak);

  await db.query(
    `UPDATE learning_streaks
     SET current_streak = $1, longest_streak = $2, last_activity_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3`,
    [newStreak, newLongest, userId]
  );

  return { currentStreak: newStreak, longestStreak: newLongest, streakUpdated: true };
};

const updateDailyMission = async (userId, activityType) => {
  let col = '';
  if (activityType === 'lesson') col = 'lesson_completed';
  else if (activityType === 'vocab') col = 'vocab_practiced';
  else if (activityType === 'assessment') col = 'assessment_completed';
  else return null;

  await db.query(
    `INSERT INTO daily_missions (user_id, mission_date, ${col})
     VALUES ($1, CURRENT_DATE, true)
     ON CONFLICT (user_id, mission_date)
     DO UPDATE SET ${col} = true`,
    [userId]
  );

  // Check if mission is 100% complete and reward not claimed
  const missionRes = await db.query(
    'SELECT * FROM daily_missions WHERE user_id = $1 AND mission_date = CURRENT_DATE',
    [userId]
  );

  const mission = missionRes.rows[0];
  let rewardAwarded = false;

  if (
    mission.lesson_completed &&
    mission.vocab_practiced &&
    mission.assessment_completed &&
    !mission.is_rewarded
  ) {
    await db.query(
      'UPDATE daily_missions SET is_rewarded = true WHERE user_id = $1 AND mission_date = CURRENT_DATE',
      [userId]
    );

    // Award 50 bonus points
    await db.query(
      `INSERT INTO points_ledger (user_id, points, reason, reference_id)
       VALUES ($1, 50, 'Daily Mission Complete Bonus!', 'daily_mission_bonus')`,
      [userId]
    );
    rewardAwarded = true;
  }

  return { ...mission, rewardAwarded };
};

const getDailyMission = async (userId) => {
  const res = await db.query(
    'SELECT * FROM daily_missions WHERE user_id = $1 AND mission_date = CURRENT_DATE',
    [userId]
  );

  if (res.rows.length === 0) {
    const initRes = await db.query(
      `INSERT INTO daily_missions (user_id, mission_date, lesson_completed, vocab_practiced, assessment_completed)
       VALUES ($1, CURRENT_DATE, false, false, false)
       RETURNING *`,
      [userId]
    );
    return initRes.rows[0];
  }

  return res.rows[0];
};

const evaluateAchievements = async (userId) => {
  const newlyUnlocked = [];

  // Get all achievements
  const allAchRes = await db.query('SELECT * FROM achievements');
  const userAchRes = await db.query('SELECT achievement_id FROM user_achievements WHERE user_id = $1', [userId]);
  const unlockedIds = new Set(userAchRes.rows.map((r) => r.achievement_id));

  // User stats
  const lessonsRes = await db.query('SELECT COUNT(*)::int AS count FROM learning_progress WHERE user_id = $1 AND status = $2', [userId, 'completed']);
  const completedLessons = lessonsRes.rows[0].count;

  const streakRes = await db.query('SELECT current_streak FROM learning_streaks WHERE user_id = $1', [userId]);
  const currentStreak = streakRes.rows.length > 0 ? streakRes.rows[0].current_streak : 0;

  const perfectRes = await db.query('SELECT COUNT(*)::int AS count FROM assessment_results WHERE user_id = $1 AND score = 100', [userId]);
  const perfectScores = perfectRes.rows[0].count;

  const vaultMasterRes = await db.query('SELECT COUNT(*)::int AS count FROM mistake_vault WHERE user_id = $1 AND mastered = true', [userId]);
  const masteredMistakes = vaultMasterRes.rows[0].count;

  for (const ach of allAchRes.rows) {
    if (unlockedIds.has(ach.id)) continue;

    let qualifies = false;
    if (ach.code === 'FIRST_STEP' && completedLessons >= 1) qualifies = true;
    if (ach.code === 'SEVEN_DAY_STREAK' && currentStreak >= 7) qualifies = true;
    if (ach.code === 'PERFECT_SCORE' && perfectScores >= 1) qualifies = true;
    if (ach.code === 'BOOKWORM' && completedLessons >= 5) qualifies = true;
    if (ach.code === 'COMEBACK' && masteredMistakes >= 3) qualifies = true;

    if (qualifies) {
      await db.query(
        'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, ach.id]
      );
      await db.query(
        'INSERT INTO points_ledger (user_id, points, reason, reference_id) VALUES ($1, $2, $3, $4)',
        [userId, ach.points_reward, `Unlocked Achievement: ${ach.title}`, `ach_${ach.id}`]
      );
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
};

const getAchievements = async (userId) => {
  const res = await db.query(
    `SELECT a.*, 
            ua.unlocked_at, 
            (ua.unlocked_at IS NOT NULL) AS is_unlocked
     FROM achievements a
     LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
     ORDER BY is_unlocked DESC, a.points_reward ASC`,
    [userId]
  );
  return res.rows;
};

const generateCertificate = async (userId, courseId) => {
  // Check if course is completed
  const enrollRes = await db.query(
    'SELECT status, completed_at FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  );

  if (enrollRes.rows.length === 0 || enrollRes.rows[0].status !== 'completed') {
    const err = new Error('You must complete all lessons in this course before generating a certificate');
    err.statusCode = 400;
    throw err;
  }

  // Check if certificate already exists
  const existing = await db.query(
    'SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // Fetch learner name and course title
  const userRes = await db.query('SELECT full_name FROM users WHERE id = $1', [userId]);
  const courseRes = await db.query('SELECT title FROM courses WHERE id = $1', [courseId]);

  const learnerName = userRes.rows[0].full_name;
  const courseTitle = courseRes.rows[0].title;
  const certificateCode = `LL-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const certRes = await db.query(
    `INSERT INTO certificates (certificate_code, user_id, course_id, learner_name, course_title, final_score)
     VALUES ($1, $2, $3, $4, $5, 100.0)
     RETURNING *`,
    [certificateCode, userId, courseId, learnerName, courseTitle]
  );

  return certRes.rows[0];
};

const getCertificates = async (userId) => {
  const res = await db.query(
    `SELECT c.*, co.thumbnail_url, l.name AS language_name
     FROM certificates c
     JOIN courses co ON c.course_id = co.id
     JOIN languages l ON co.language_id = l.id
     WHERE c.user_id = $1
     ORDER BY c.issued_at DESC`,
    [userId]
  );
  return res.rows;
};

module.exports = {
  updateStreak,
  updateDailyMission,
  getDailyMission,
  evaluateAchievements,
  getAchievements,
  generateCertificate,
  getCertificates,
};
