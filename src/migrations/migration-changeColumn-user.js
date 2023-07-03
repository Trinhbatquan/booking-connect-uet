"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('Users', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   email: {
    //     type: Sequelize.STRING
    //   },
    //   password: {
    //     type: Sequelize.STRING
    //   },
    //   fullName: {
    //     type: Sequelize.STRING
    //   },
    //   address: {
    //     type: Sequelize.STRING
    //   },
    //   gender: {
    //     type: Sequelize.STRING
    //   },
    //   roleId: {
    //     type: Sequelize.STRING
    //   },
    //   phoneNumber: {
    //     type: Sequelize.STRING
    //   },
    //   image: {
    //     type: Sequelize.STRING
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // });
    return Promise.all([
      await queryInterface.changeColumn("Admins", "image", {
        type: Sequelize.BLOB("long"),
        allowNull: true,
      }),
      await queryInterface.removeColumn("Admins", "fullName"),
      await queryInterface.removeColumn("Admins", "address"),
      await queryInterface.removeColumn("Admins", "gender"),
      await queryInterface.removeColumn("Admins", "roleId"),
      await queryInterface.removeColumn("Admins", "image"),
      await queryInterface.removeColumn("Admins", "positionId"),
      await queryInterface.removeColumn("Admins", "verified"),
      // await queryInterface.renameTable("Users", "Admins"),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("your table name ", "name", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
};
