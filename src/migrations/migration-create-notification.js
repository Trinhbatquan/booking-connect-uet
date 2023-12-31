"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface,Sequelize) {
    await queryInterface.createTable("Notifications",{
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
      type_notification: {
        type: Sequelize.STRING,
      },
      bookingId: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      contentHtml: {
        type: Sequelize.TEXT("long"),
      },
      content: {
        type: Sequelize.TEXT("long"),
      },
      image: {
        type: Sequelize.BLOB("long"),
      },
      code_url: {
        type: Sequelize.STRING,
      },
      isNew: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
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
    await queryInterface.dropTable("Notifications");
  },
};
