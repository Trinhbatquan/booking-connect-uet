"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "bookingData",
      }),
        Notification.belongsTo(models.AllCode, {
          foreignKey: "type_notification",
          targetKey: "keyMap",
          as: "notificationType",
        });
    }
  }
  Notification.init(
    {
      managerId: DataTypes.INTEGER,
      roleManager: DataTypes.STRING,
      type_notification: DataTypes.STRING,
      bookingId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT("long"),
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
