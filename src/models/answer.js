"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      as: "timeDataBooking",
        Answer.belongsTo(models.Booking, {
          foreignKey: "questionId",
          as: "answerData",
        });
    }
  }
  Answer.init(
    {
      answer: DataTypes.TEXT("long"),
      questionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Answer",
    }
  );
  return Answer;
};
