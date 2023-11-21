"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.AllCode, {
        foreignKey: "timeType",
        targetKey: "keyMap",
        as: "timeDataBooking",
      }),
        Booking.belongsTo(models.Student, {
          foreignKey: "studentId",
          targetKey: "id",
          as: "studentData",
        }),
        Booking.belongsTo(models.Teacher, {
          foreignKey: "managerId",
          targetKey: "id",
          as: "teacherData",
        }),
        Booking.belongsTo(models.OtherUser, {
          foreignKey: "managerId",
          targetKey: "id",
          as: "otherUserData",
        }),
        Booking.hasOne(models.Answer, {
          foreignKey: "questionId",
          as: "answerData",
        }),
        Booking.hasOne(models.Notification, {
          foreignKey: "bookingId",
          as: "bookingData",
        });
    }
  }
  Booking.init(
    {
      managerId: DataTypes.INTEGER,
      roleManager: DataTypes.STRING,
      studentId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      timeType: DataTypes.STRING,
      reason: DataTypes.TEXT("long"),
      subject: DataTypes.STRING,
      question: DataTypes.TEXT("long"),
      others: DataTypes.STRING,
      actionId: DataTypes.STRING,
      statusId: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      questionSimilarityId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
