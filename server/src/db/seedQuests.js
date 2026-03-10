export const seedQuestsAndAchievements = async (db) => {
  try {
    const achievements = [];

    // 1–15: достижения за завершённые курсы
    const courseTargets = [1, 2, 3, 5, 7, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50];
    courseTargets.forEach((value, idx) => {
      const i = idx + 1;
      achievements.push({
        code: `ach_${i}`,
        title: `Финишер ${value} курс(ов)`,
        description: `Вы завершили ${value} курс(ов). Вы двигаетесь вперёд быстрее, чем большинство!`,
        sortOrder: i,
      });
    });

    // 16–30: достижения за серию дней
    const streakTargets = [2, 3, 5, 7, 10, 14, 21, 28, 35, 42, 50, 60, 75, 90, 100];
    streakTargets.forEach((value, idx) => {
      const i = 16 + idx;
      achievements.push({
        code: `ach_${i}`,
        title: `Серия ${value} дней`,
        description: `Вы занимались ${value} дней подряд — это уровень настоящей дисциплины и упорства.`,
        sortOrder: i,
      });
    });

    // 31–40: достижения за количество выполненных квестов
    const questTargets = [1, 3, 5, 7, 10, 15, 20, 25, 30, 35];
    questTargets.forEach((value, idx) => {
      const i = 31 + idx;
      achievements.push({
        code: `ach_${i}`,
        title: `Охотник за квестами (${value})`,
        description: `Вы выполнили ${value} квест(ов). Уровень вашей мотивации растёт с каждой задачей.`,
        sortOrder: i,
      });
    });

    await db.query(
      `INSERT INTO achievements (code, title, description, sort_order)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         sort_order = VALUES(sort_order)`,
      [achievements.map((a) => [a.code, a.title, a.description, a.sortOrder])],
    );

    const [insertedAchievements] = await db.query(
      "SELECT id, code FROM achievements WHERE code LIKE 'ach_%' ORDER BY sort_order ASC",
    );
    const achByCode = new Map(insertedAchievements.map((row) => [row.code, row.id]));

    const quests = [];

    // 1–15: complete_courses
    courseTargets.forEach((value, idx) => {
      const i = idx + 1;
      quests.push({
        code: `quest_courses_${value}`,
        title: `Пройди ${value} курс(ов)`,
        description: `Завершите ${value} курс(ов), чтобы сформировать сильный фундамент знаний.`,
        requirementType: 'complete_courses',
        requirementValue: value,
        rewardCode: `ach_${i}`,
        sortOrder: i,
      });
    });

    // 16–30: lesson_streak
    streakTargets.forEach((value, idx) => {
      const i = 16 + idx;
      quests.push({
        code: `quest_streak_${value}`,
        title: `Серия из ${value} дней`,
        description: `Учитесь без перерыва ${value} дней — докажите себе, что вы упорный и последовательный ученик.`,
        requirementType: 'lesson_streak',
        requirementValue: value,
        rewardCode: `ach_${i}`,
        sortOrder: i,
      });
    });

    // 31–40: quests_completed
    questTargets.forEach((value, idx) => {
      const i = 31 + idx;
      quests.push({
        code: `quest_meta_${value}`,
        title: `Заверши ${value} квест(ов)`,
        description: `Выполните ${value} квест(ов) и покажите, что умеете доводить задачи до конца.`,
        requirementType: 'quests_completed',
        requirementValue: value,
        rewardCode: `ach_${i}`,
        sortOrder: i,
      });
    });

    await db.query(
      `INSERT INTO quests
       (code, title, description, requirement_type, requirement_value, reward_achievement_id, sort_order)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         requirement_type = VALUES(requirement_type),
         requirement_value = VALUES(requirement_value),
         reward_achievement_id = VALUES(reward_achievement_id),
         sort_order = VALUES(sort_order)`,
      [
        quests.map((q) => [
          q.code,
          q.title,
          q.description,
          q.requirementType,
          q.requirementValue,
          achByCode.get(q.rewardCode),
          q.sortOrder,
        ]),
      ],
    );
  } catch (error) {
    console.error('Error seeding quests and achievements', error);
  }
};

