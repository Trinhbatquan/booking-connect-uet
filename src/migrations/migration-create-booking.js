"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      managerId: {
        type: Sequelize.INTEGER,
      },
      roleManager: {
        type: Sequelize.STRING,
      },
      studentId: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
      },
      timeType: {
        type: Sequelize.STRING,
      },
      actionId: {
        type: Sequelize.STRING,
      },
      reason: {
        type: Sequelize.TEXT("long"),
      },
      subject: {
        type: Sequelize.STRING,
      },
      question: {
        type: Sequelize.TEXT("long"),
      },
      others: {
        type: Sequelize.STRING,
      },
      statusId: {
        type: Sequelize.STRING,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("booking");
  },
};
