import express from 'express';
import { db } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

export const questsRouter = express.Router();

questsRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [quests] = await db.query(
      `SELECT q.id, q.code, q.title, q.description, q.requirement_type, q.requirement_value,
              q.reward_achievement_id, q.sort_order,
              uq.status AS user_status, uq.progress_value
       FROM quests q
       LEFT JOIN user_quests uq ON uq.quest_id = q.id AND uq.user_id = ?
       ORDER BY q.sort_order ASC, q.id ASC`,
      [userId],
    );

    const [achievements] = await db.query(
      `SELECT a.id, a.code, a.title, a.description,
              ua.user_id IS NOT NULL AS unlocked
       FROM achievements a
       LEFT JOIN user_achievements ua
         ON ua.achievement_id = a.id
        AND ua.user_id = ? 
       ORDER BY a.sort_order ASC, a.id ASC`,
      [userId],
    );

    res.json({
      quests: quests.map((q) => ({
        id: q.id,
        code: q.code,
        title: q.title,
        description: q.description,
        requirementType: q.requirement_type,
        requirementValue: q.requirement_value,
        rewardAchievementId: q.reward_achievement_id,
        status: q.user_status || 'locked',
        progressValue: q.progress_value || 0,
      })),
      achievements: achievements.map((a) => ({
        id: a.id,
        code: a.code,
        title: a.title,
        description: a.description,
        unlocked: !!a.unlocked,
      })),
    });
  } catch (error) {
    console.error('Get quests error', error);
    res.status(500).json({ message: 'Ошибка загрузки квестов' });
  }
});

questsRouter.post('/sync', authMiddleware, async (req, res) => {
  const { totalCourses, completedCourses, lessonStreak, questsCompleted } = req.body || {};
  const userId = req.user.id;

  try {
    const [quests] = await db.query(
      'SELECT * FROM quests ORDER BY sort_order ASC, id ASC',
    );

    const achievementsUnlocked = [];

    for (const quest of quests) {
      let currentValue = 0;
      switch (quest.requirement_type) {
        case 'complete_courses':
          currentValue = Number(completedCourses || 0);
          break;
        case 'lesson_streak':
          currentValue = Number(lessonStreak || 0);
          break;
        case 'quests_completed':
          currentValue = Number(questsCompleted || 0);
          break;
        default:
          currentValue = 0;
      }

      const [userQuestRows] = await db.query(
        'SELECT * FROM user_quests WHERE user_id = ? AND quest_id = ?',
        [userId, quest.id],
      );

      let status = userQuestRows.length ? userQuestRows[0].status : 'locked';

      if (status !== 'completed') {
        status = currentValue > 0 ? 'in_progress' : 'locked';
        if (currentValue >= quest.requirement_value) {
          status = 'completed';
        }

        if (userQuestRows.length === 0) {
          await db.query(
            'INSERT INTO user_quests (user_id, quest_id, status, progress_value) VALUES (?, ?, ?, ?)',
            [userId, quest.id, status, currentValue],
          );
        } else {
          await db.query(
            'UPDATE user_quests SET status = ?, progress_value = ? WHERE id = ?',
            [status, currentValue, userQuestRows[0].id],
          );
        }
      }

      if (status === 'completed') {
        const [ua] = await db.query(
          'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
          [userId, quest.reward_achievement_id],
        );
        if (ua.length === 0) {
          await db.query(
            'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
            [userId, quest.reward_achievement_id],
          );
          achievementsUnlocked.push(quest.reward_achievement_id);
        }
      }
    }

    res.json({ achievementsUnlocked });
  } catch (error) {
    console.error('Sync quests error', error);
    res.status(500).json({ message: 'Ошибка обновления квестов' });
  }
});

