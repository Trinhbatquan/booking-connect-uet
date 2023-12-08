"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface,Sequelize) {
    await queryInterface.createTable("Students",{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      faculty: {
        type: Sequelize.STRING,
      },
      classroom: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("Students");
  },
};
