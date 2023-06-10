'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  History.init({
    studentId: DataTypes.INTEGER,
    departmentId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    actionId: DataTypes.STRING,
    files: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};