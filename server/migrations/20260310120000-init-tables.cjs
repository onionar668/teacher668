"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable("users", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.createTable("courses", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      introduction: { type: DataTypes.TEXT, allowNull: true },
      program_json: { type: DataTypes.JSON, allowNull: false },
      is_ai_generated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_predefined: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      topic: { type: DataTypes.STRING(255), allowNull: true },
      owner_user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });
    await queryInterface.addConstraint("courses", {
      fields: ["owner_user_id"],
      type: "foreign key",
      name: "fk_courses_owner_user",
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.createTable("user_course_progress", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      course_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      progress_json: { type: DataTypes.JSON, allowNull: false },
      completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addConstraint("user_course_progress", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_ucp_user",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("user_course_progress", {
      fields: ["course_id"],
      type: "foreign key",
      name: "fk_ucp_course",
      references: { table: "courses", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("user_course_progress", {
      fields: ["user_id", "course_id"],
      type: "unique",
      name: "uniq_user_course",
    });

    await queryInterface.createTable("achievements", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      sort_order: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    });

    await queryInterface.createTable("user_achievements", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      achievement_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      unlocked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });
    await queryInterface.addConstraint("user_achievements", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_user_achievements_user",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("user_achievements", {
      fields: ["achievement_id"],
      type: "foreign key",
      name: "fk_user_achievements_achievement",
      references: { table: "achievements", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("user_achievements", {
      fields: ["user_id", "achievement_id"],
      type: "unique",
      name: "uniq_user_achievement",
    });

    await queryInterface.createTable("quests", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      requirement_type: {
        type: DataTypes.ENUM("complete_courses", "lesson_streak", "quests_completed", "custom"),
        allowNull: false,
      },
      requirement_value: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      reward_achievement_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      sort_order: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    });
    await queryInterface.addConstraint("quests", {
      fields: ["reward_achievement_id"],
      type: "foreign key",
      name: "fk_quests_reward_achievement",
      references: { table: "achievements", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.createTable("user_quests", {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      quest_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      status: {
        type: DataTypes.ENUM("locked", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "locked",
      },
      progress_value: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addConstraint("user_quests", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_user_quests_user",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("user_quests", {
      fields: ["quest_id"],
      type: "foreign key",
      name: "fk_user_quests_quest",
      references: { table: "quests", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("user_quests", {
      fields: ["user_id", "quest_id"],
      type: "unique",
      name: "uniq_user_quest",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_quests");
    await queryInterface.dropTable("quests");
    await queryInterface.dropTable("user_achievements");
    await queryInterface.dropTable("achievements");
    await queryInterface.dropTable("user_course_progress");
    await queryInterface.dropTable("courses");
    await queryInterface.dropTable("users");
  },
};

