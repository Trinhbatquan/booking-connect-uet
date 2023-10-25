"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student_FeedBack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   Student_FeedBack.belongsTo(models.AllCode, {
      //     foreignKey: "positionId",
      //     targetKey: "keyMap",
      //     as: "positionData",
      //   }),
      Student_FeedBack.belongsTo(models.Student, {
        foreignKey: "studentId",
        targetKey: "id",
        as: "studentData_FeedBack",
      });
    }
  }
  Student_FeedBack.init(
    {
      studentId: DataTypes.INTEGER,
      system: DataTypes.TEXT("long"),
      infrastructure: DataTypes.TEXT("long"),
      education_quality: DataTypes.TEXT("long"),
      school_activities: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Student_FeedBack",
    }
  );
  return Student_FeedBack;
};
