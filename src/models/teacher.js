"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsTo(models.AllCode, {
        foreignKey: "positionId",
        targetKey: "keyMap",
        as: "positionData",
      });
      Teacher.belongsTo(models.AllCode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
      Teacher.hasOne(models.MarkDown, {
        foreignKey: "userId",
        as: "markdownData_teacher",
      });
      Teacher.belongsTo(models.OtherUser, {
        foreignKey: "facultyId",
        as: "facultyData",
      });
      Teacher.hasMany(models.Booking, {
        foreignKey: "managerId",
        as: "teacherData",
      });
    }
  }
  Teacher.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      positionId: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      facultyId: DataTypes.INTEGER,
      note: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      code_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );
  return Teacher;
};
