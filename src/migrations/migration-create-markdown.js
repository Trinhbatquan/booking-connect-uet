"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface,Sequelize) {
    await queryInterface.createTable("MarkDowns",{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      markdownHtml: {
        type: Sequelize.TEXT("long"),
      },
      markdownText: {
        type: Sequelize.TEXT("long"),
      },
      description: {
        type: Sequelize.TEXT("long"),
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      type: {
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
  async down(queryInterface,Sequelize) {
    await queryInterface.dropTable("MarkDowns");
  },
};
