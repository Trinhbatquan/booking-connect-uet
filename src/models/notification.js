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
      studentId: DataTypes.INTEGER,
      type_notification: DataTypes.STRING,
      bookingId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      contentHtml: DataTypes.TEXT("long"),
      content: DataTypes.TEXT("long"),
      image: DataTypes.BLOB("long"),
      code_url: DataTypes.STRING,
      isNew: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
