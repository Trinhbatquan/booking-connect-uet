"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   Teacher_Info.belongsTo(models.AllCode, {
      //     foreignKey: "timeType",
      //     targetKey: "keyMap",
      //     as: "timeData",
      //   });
    }
  }
  Teacher_Info.init(
    {
      teacher_id: DataTypes.INTEGER,
      faculty_id: DataTypes.INTEGER,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Teacher_Info",
    }
  );
  return Teacher_Info;
};
