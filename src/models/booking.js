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
      question: DataTypes.TEXT("long"),
      actionId: DataTypes.STRING,
      statusId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};