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
      queryInterface.changeColumn("Users", "image", {
        type: Sequelize.BLOB("long"),
        allowNull: true,
      }),
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
