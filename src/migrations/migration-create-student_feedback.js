"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface,Sequelize) {
    await queryInterface.createTable("Student_FeedBacks",{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.INTEGER,
      },
      system: {
        type: Sequelize.TEXT("long"),
      },
      infrastructure: {
        type: Sequelize.TEXT("long"),
      },
      education_quality: {
        type: Sequelize.TEXT("long"),
      },
      school_activities: {
        type: Sequelize.TEXT("long"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface,Sequelize) {
    await queryInterface.dropTable("Student_FeedBacks");
  },
};
